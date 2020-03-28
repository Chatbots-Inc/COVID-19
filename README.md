# COVID-19

Este chatbot esté encargado de resolver preguntas sobre la enfermedad COVID-19.

## Recursos

- Dialogflow (![Consola](https://dialogflow.cloud.google.com/), ![documentación](https://cloud.google.com/dialogflow/docs/))
- Google Sheets (![Editable](https://docs.google.com/spreadsheets/d/19EMlDcnfZOpxq-L1UoRBcA4F-JoQZl58LEjTUExlJzo/edit?usp=sharing))

## Manual de uso (Dialogflow Fullfillment)

1. Instalar funciones de firebase
```bash
npm install -g firebase-tools
firebase init
```
2. Clonar el repositorio
```bash
git clone https://github.com/Chatbots-Inc/ChatbotSI-Beta.git
```
3. Activar firebase y vincularlo al proyecto en el que está trabajando
```bash
cd ChatbotSI-Beta/
firebase use <ID_DEL_PROYECTO>
```
4. Cambiarse al directorio de funciones e instalar los módulos necesarios
```bash
cd functions/
npm install npm-modules --save-dev
npm install actions-on-google --save-dev
npm install firebase-admin --save-dev
```
5. Hacer las modificaciones pertinentes al archivo `index.js` para adecuar las funcionalidades de la aplicación
6. Publicar las modificaciones
```bash
firebase deploy
```
