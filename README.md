<div align="right">
  <a href="#interview-assistant-español">Español</a> | <a href="#interview-assistant-english">English</a>
</div>

# interview-assistant-español

Interview Assistant es una aplicación basada en Electron que captura audio del sistema y proporciona sugerencias de respuesta en tiempo real para entrevistas.

## Por qué Interview Assistant

1. **Conversión de voz a texto en tiempo real**: Utiliza Deepgram API para reconocimiento de voz en tiempo real.
2. **Respuestas inteligentes con GPT**: Integra el modelo GPT de OpenAI para proporcionar sugerencias de respuesta inteligentes e instantáneas para preguntas de entrevista. (Soporta API de terceros con direcciones de reenvío)
3. **Gestión de contenidos**: Los usuarios pueden cargar sus propios archivos, incluidos textos, imágenes y archivos PDF, junto con indicaciones personalizadas, personalizando enormemente el estilo de las respuestas de GPT. Estos materiales se utilizarán para personalizar las respuestas de GPT.
4. **Contexto unificado**: En la página de respuesta en tiempo real, las conversaciones se basan en la configuración de la página de conocimiento, todo dentro del mismo contexto, asegurando la coherencia y relevancia de las respuestas.
5. **Soporte multiplataforma**: Como aplicación Electron, puede ejecutarse en sistemas Windows y macOS.

## Demostración

[Video de demostración de Interview Assistant](https://github.com/user-attachments/assets/3b42cc96-1b67-48e1-b40c-dbd78c328f1b)

Haga clic en el enlace anterior para ver el video de demostración.

## Comparación con otras herramientas

Interview Assistant tiene las siguientes ventajas en comparación con otras herramientas de asistencia para entrevistas:

1. **Reconocimiento de voz en tiempo real**: Utilizando Deepgram API (los nuevos usuarios obtienen crédito de $200), proporcionamos transcripción en tiempo real más rápida y precisa que el reconocimiento de voz tradicional.
2. **Base de conocimiento personalizada**: Los usuarios pueden cargar sus propios currículums, información personal y otros documentos. El modelo GPT proporcionará sugerencias de respuesta más personalizadas basadas en esta información.
3. **Soporte multiplataforma**: Como aplicación Electron, compatible con Windows y macOS.
4. **Protección de privacidad**: Todos los datos se procesan localmente y no se cargan en la nube, protegiendo la información privada de los usuarios.
5. **Transparencia de código abierto**: Nuestro código es completamente de código abierto, libre de ver, modificar y contribuir.

A continuación se muestra una tabla de comparación de características de Interview Assistant con otras herramientas de asistencia para entrevistas:

|                                                      | Windows | Mac  | Indicaciones personalizadas/Carga de archivos personales |
| ---------------------------------------------------- | ------- | ---- | -------------------------------------------------------- |
| [cheetah](https://github.com/leetcode-mafia/cheetah) |         | ✅    |                                                          |
| [ecoute](https://github.com/SevaSk/ecoute)           | ✅       |      |                                                          |
| Interview Assistant                                  | ✅       | ✅    | ✅                                                        |

Esta tabla de comparación muestra claramente las ventajas de Interview Assistant en comparación con otras herramientas, especialmente en términos de soporte multiplataforma e indicaciones personalizadas.

## Instalación y uso

1. Descargue el paquete de instalación adecuado para su sistema operativo desde la página Release.
2. Ejecute Interview Assistant.
3. Configure su clave API de OpenAI y su clave API de Deepgram en la página de configuración.
4. Comience a utilizar la función de asistencia para entrevistas en tiempo real o administre su base de conocimiento.

## Instrucciones de configuración

Para utilizar Interview Assistant, necesita:

1. **Clave API de OpenAI**: Se puede obtener de https://platform.openai.com, o puede comprar una API de terceros con una dirección de reenvío que también se admite. Recuerde seleccionar la casilla de reenvío y puede hacer clic en el botón de prueba para verificar después de la configuración.
2. **Clave API de Deepgram**: Visite https://deepgram.com para registrarse y obtener. Los nuevos usuarios obtienen $200 de crédito gratuito y el tutorial de la página de inicio es simple.

![image-20240919163506505](https://cdn.jsdelivr.net/gh/filifili233/blogimg@master/uPic/image-20240919163506505.png)

## Desarrollo

Este proyecto se desarrolla basado en Electron y React. Siga estos pasos:

1. Clonar el repositorio: `git clone https://github.com/nohairblingbling/Interview-Assistant`
2. Instalar dependencias: `pnpm install`
3. Instalar Electron: `npm install electron`
4. Iniciar el servidor de desarrollo: `npm start`
5. Construir la aplicación: `npm run make`

## Licencia

Este proyecto está bajo la Licencia MIT. Consulte el archivo LICENSE para más detalles.

---

# interview-assistant-english

Interview Assistant is an Electron-based application that captures system audio (online meetings) and provides real-time interview response suggestions.

## Why Interview Assistant

1. **Real-time Speech-to-Text**: Utilizes Deepgram API for real-time speech recognition.
2. **Intelligent GPT Responses**: Integrates OpenAI's GPT model to provide instant, intelligent answer suggestions for interview questions. (Supports third-party APIs with forwarding addresses)
3. **Content Management**: Users can upload their own files, including text, images, and PDF files, along with customized prompts, greatly customizing the style of GPT responses. These materials will be used to personalize GPT's answers.
4. **Unified Context**: In the real-time response page, conversations are based on the knowledge page configuration, all within the same context, ensuring coherence and relevance of answers.
5. **Cross-platform Support**: As an Electron application, it can run on Windows and macOS systems.

## Demo

[Interview Assistant Demo Video](https://github.com/user-attachments/assets/3b42cc96-1b67-48e1-b40c-dbd78c328f1b)

Click the link above to view the demo video.

## Comparison with Other Tools

Interview Assistant has the following advantages compared to other interview assistance tools:

1. **Real-time Speech Recognition**: Using Deepgram API (new users get $200 credit), we provide faster and more accurate real-time transcription than traditional speech recognition.
2. **Personalized Knowledge Base**: Users can upload their own resumes, personal information, and other documents. The GPT model will provide more personalized answer suggestions based on this information.
3. **Cross-platform Support**: As an Electron application, it supports Windows and macOS.
4. **Privacy Protection**: All data is processed locally and not uploaded to the cloud, protecting users' privacy.
5. **Open Source Transparency**: Our code is completely open source, free to view, modify, and contribute to.

Below is a feature comparison table of Interview Assistant with other interview assistance tools:

|                                                      | Windows | Mac | Custom prompts/Personal file upload |
| ---------------------------------------------------- | ------- | --- | ----------------------------------- |
| [cheetah](https://github.com/leetcode-mafia/cheetah) |         | ✅   |                                     |
| [ecoute](https://github.com/SevaSk/ecoute)           | ✅       |     |                                     |
| Interview Assistant                                  | ✅       | ✅   | ✅                                   |

This comparison table clearly shows the advantages of Interview Assistant compared to other tools, especially in terms of cross-platform support and custom prompts.

## Installation and Usage

1. Download the installation package suitable for your operating system from the Release page.
2. Run Interview Assistant.
3. Configure your OpenAI API key and Deepgram API key on the settings page.
4. Start using the real-time interview assistance feature or manage your knowledge base.

## Configuration Instructions

To use Interview Assistant, you need:

1. **OpenAI API key**: Can be obtained from https://platform.openai.com, or you can purchase a third-party API with a forwarding address which is also supported. Remember to select the forwarding checkbox, and you can click the test button to test after configuration.
2. **Deepgram API key**: Please visit https://deepgram.com to register and obtain. New users get $200 free credit, and the homepage tutorial is simple.

![image-20240919163506505](https://cdn.jsdelivr.net/gh/filifili233/blogimg@master/uPic/image-20240919163506505.png)

## Development

This project is developed based on Electron and React. Please follow these steps:

1. Clone the repository: `git clone https://github.com/nohairblingbling/Interview-Assistant`
2. Install dependencies: `pnpm install`
3. Install Electron: `npm install electron`
4. Start the development server: `npm start`
5. Build the application: `npm run make`

## License

This project is licensed under the MIT License. See the LICENSE file for details.
