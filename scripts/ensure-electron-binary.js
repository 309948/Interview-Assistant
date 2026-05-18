/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { downloadArtifact } = require('@electron/get');

function getPlatformExecutableName() {
  switch (process.platform) {
    case 'win32':
      return 'electron.exe';
    case 'darwin':
      return 'Electron.app/Contents/MacOS/Electron';
    default:
      return 'electron';
  }
}

function readPathFile(pathFile) {
  try {
    return fs.readFileSync(pathFile, 'utf-8').trim();
  } catch {
    return null;
  }
}

function isElectronInstalled(electronDir) {
  const pathFile = path.join(electronDir, 'path.txt');
  const executableFromPath = readPathFile(pathFile);
  const expectedExecutable = getPlatformExecutableName();
  const executableName = executableFromPath || expectedExecutable;
  const executablePath = path.join(electronDir, 'dist', executableName);
  return fs.existsSync(executablePath);
}

async function extractZip(zipPath, distPath) {
  fs.rmSync(distPath, { recursive: true, force: true });
  fs.mkdirSync(distPath, { recursive: true });

  try {
    execFileSync('tar', ['-xf', zipPath, '-C', distPath], { stdio: 'inherit' });
    return;
  } catch (tarError) {
    const extract = require('extract-zip');
    await extract(zipPath, { dir: distPath });
  }
}

async function ensureElectronBinary() {
  if (process.env.ELECTRON_SKIP_BINARY_DOWNLOAD) {
    console.log('Skipping Electron binary setup (ELECTRON_SKIP_BINARY_DOWNLOAD=true)');
    return;
  }

  const electronPkgJsonPath = require.resolve('electron/package.json');
  const electronDir = path.dirname(electronPkgJsonPath);
  const pathFile = path.join(electronDir, 'path.txt');
  const distPath = path.join(electronDir, 'dist');

  if (isElectronInstalled(electronDir)) {
    return;
  }

  const electronPkg = require(electronPkgJsonPath);
  const checksumsPath = path.join(electronDir, 'checksums.json');
  const checksums = fs.existsSync(checksumsPath) ? require(checksumsPath) : undefined;

  console.log(`Repairing Electron binary for ${process.platform}-${process.arch}...`);
  const zipPath = await downloadArtifact({
    version: electronPkg.version,
    artifactName: 'electron',
    platform: process.env.npm_config_platform || process.platform,
    arch: process.env.npm_config_arch || process.arch,
    checksums,
    cacheRoot: process.env.electron_config_cache
  });

  await extractZip(zipPath, distPath);
  fs.writeFileSync(pathFile, getPlatformExecutableName());

  if (!isElectronInstalled(electronDir)) {
    throw new Error('Electron binary installation repair failed');
  }
}

ensureElectronBinary().catch((error) => {
  console.error(error && error.stack ? error.stack : error);
  process.exit(1);
});
