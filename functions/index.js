'use strict';
const DialogflowApp = require('actions-on-google').DialogflowApp,
    functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'ws://covid-19-bjmcqv.firebaseio.com/'
})

exports.covidBotTam = functions.https.onRequest((request, response) => {
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
  if (request.body.queryResult) {
    processV2Request(request, response);
  } else {
    console.log('Invalid Request');
    return response.status(400).end('Invalid Webhook Request (expecting v1 or v2 webhook request)');
  }
});

function processV2Request(request, response) {
  let action = (request.body.queryResult.action) ? request.body.queryResult.action : 'default';
  const actionHandlers = {
    'default': () => {
      sendResponse("Default Response");
    }
  };

  if (!actionHandlers[action]) {
    action = 'default';
  }

  actionHandlers[action]();
  function sendResponse(responseToUser) {
    if (typeof responseToUser === 'string') {
      let responseJson = {
        fulfillmentText: responseToUser
      };
      response.json(responseJson);
    } else {
      let responseJson = {};
      responseJson.fulfillmentText = responseToUser.fulfillmentText;
      if (responseToUser.fulfillmentMessages) {
        responseJson.fulfillmentMessages = responseToUser.fulfillmentMessages;
      }
      if (responseToUser.outputContexts) {
        responseJson.outputContexts = responseToUser.outputContexts;
      }
      response.json(responseJson);
    }
  }
}


// Parte de la base de datos
exports.CovidToFirebase = functions.https.onRequest((request, response) => {
  console.log('Request headers: ' + JSON.stringify(request.headers));
  console.log('Request body: ' + JSON.stringify(request.body));
  //console.log('Rsponse headers: ' + JSON.stringify(request.cookies));
  // console.log('Response body: ' + JSON.stringify(response.body));

  var a = JSON.stringify(request.body.responseId);	                          // Para obtener el id de respuesta
  var b = JSON.stringify(request.body.queryResult.intent.displayName);		    // Para obtener el intent
  var c = JSON.stringify(request.body.queryResult.queryText);			            // Para obtener la solicitud del usuario
  var d = JSON.stringify(request.body.queryResult.intentDetectionConfidence);	// Para obtener el parámetro de confianza
  var e = JSON.stringify(request.body.session);   // Id de la sesion

  // Limpiamos la primera parte de los datos.
  a = a.substring(1);
  b = b.substring(1);
  c = c.substring(1);
  e = e.substring(41);

  // Limpiamos la ultima parte de los datos.
  a = a.slice(0,-1);
  b = b.slice(0,-1);
  c = c.slice(0,-1);
  e = e.slice(0,-1);

  return admin.database().ref("analytics_ref").push({
    IntentName: b,
    TextQuery:  c,
    Confidence: d,
    responseId: a,
    SessionId:  e
  })
})
