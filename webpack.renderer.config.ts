import type { Configuration } from 'webpack';

import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';

const rendererRules = rules.filter((rule) => {
  if (typeof rule !== 'object' || rule === null) return true;

  if ('use' in rule) {
    if (rule.use === 'node-loader') return false;

    if (
      typeof rule.use === 'object' &&
      rule.use !== null &&
      'loader' in rule.use &&
      rule.use.loader === '@vercel/webpack-asset-relocator-loader'
    ) {
      return false;
    }
  }

  return true;
});

rendererRules.push({
  test: /\.css$/,
  use: [
    { loader: 'style-loader' },
    { loader: 'css-loader' },
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: [require('tailwindcss'), require('autoprefixer')],
        },
      },
    },
  ],
});

export const rendererConfig: Configuration = {
  module: {
    rules: rendererRules,
  },
  plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
  },
};
