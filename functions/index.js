// Este código guarda datos en la base de datos realtime firebase. La primera parte son requerimientos de Google
// para acceder a la base de datos, la segunda parte son los datos siendo tomados y estilizados un poco. La tercera
// parte es donde se guardan.

///////////////////////////////////////////////Primera Parte///////////////////////////////////////////////////////
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

///////////////////////////////////////////////Segunda Parte///////////////////////////////////////////////////////
// Primero tomamos el request, de este objeto JSON salen casi todos los datos. Para visualizarlo mejor, puedes ir a
// la consola de Firebase, en la sección de Functions, registros y ahí se visualiza lo que se escribe en la consola.
exports.CovidToFirebase = functions.https.onRequest((request, response) => {
  console.log('Request headers: ' + JSON.stringify(request.headers));         // Escribe en la consola los datos que
  console.log('Request body: ' + JSON.stringify(request.body));               // Vamos a extraer

  // Estos son los datos que salen directamente de Dialogflow.
  var a = JSON.stringify(request.body.responseId);	                          // Id de respuesta
  var b = JSON.stringify(request.body.queryResult.intent.displayName);		    // Intent
  var c = JSON.stringify(request.body.queryResult.queryText);			            // Solicitud del usuario
  var d = JSON.stringify(request.body.queryResult.intentDetectionConfidence);	// Parámetro de confianza
  var e = JSON.stringify(request.body.session);                               // Id de la sesion

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

  // Función para determinar si un objeto está vacío o no:
  function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
  }

  // Función para obtener el índice (número de interacción en esa sesión) del query
  function getIndex(id) {
    var index = 1;
    // Obtiene una referencia de la base de datos (parecido a una copia local)
    var dataRef = admin.database().ref('analytics_ref');
    // Ordena los datos por sesión y busca el último que tenga la misma sesión que este query
    var i = dataRef.orderByChild('SessionId').equalTo(id).limitToLast(1)
      .once("child_added").then(function(snap) {
        index += snap.val().Index;
	console.log('indice adentro: ' + index);
        return index
      });
    console.log('indice afuera: ' + index);
    console.log(i);
    return index
  } 

  // Si request.body.originalDetectIntentRequest.payload viene vacío, este mensaje viene directo de Dialogflow
  // Si no viene vacío, este mensaje viene de Telegram.
  if (isEmpty(request.body.originalDetectIntentRequest.payload) === false) {
    var g = JSON.stringify(request.body.originalDetectIntentRequest.source);                        // Fuente
    g = g.substring(1,g.length-1);
    var fg = JSON.stringify(request.body.originalDetectIntentRequest.payload.data.from.first_name); // Nombre
    fg = fg.substring(1,fg.length-1);
    var lg = JSON.stringify(request.body.originalDetectIntentRequest.payload.data.from.last_name);  // Apellido
    lg = lg.substring(1,lg.length-1);
  } else {
    g = 'Dialogflow';                 // Fuente
    fg = 'No name';                   // Nombre
    lg = '';                          // Apellido
  }

  var gg = fg + String(' ') + lg;         // Nombre y Apellido

  // Para la fecha y hora se utiliza la función Date().
  var f = new Date();                                                         // Tiempo
  var H = f.toLocaleTimeString('de-DE', {hour: '2-digit',   hour12: false, timeZone: 'America/Mexico_City' }); // Hora local
  var M = f.getMinutes();                                                     // Minutos
  var S = f.getSeconds();                                                     // Segundos
  var DD = f.getDate();                                                       // Dia
  var MM = f.getMonth() + 1;                                                  // Mes
  var YY = f.getFullYear();                                                   // Año
  var T = H + ":" + M + ":" + S;                                              // Tiempo
  var F = DD + "/" + MM + "/" + YY;                                           // Fecha
  var TT = f.getTime();                                                       // Milisegundos desde 1/1/1970

  // Obtiene el índice
  var i = getIndex(e);

///////////////////////////////////////////////Tercera Parte///////////////////////////////////////////////////////
  // Se guardan todos los datos en la colección "analytics_ref". Se guardan en orden alfabético. El nombre es lo 
  // que está del lado izquierdo y el contenido del lado derecho de ":".
  return admin.database().ref("analytics_ref").push({
    IntentName: b,
    TextQuery:  c,
    Confidence: d,
    responseId: a,
    SessionId:  e,
    Hour: T,
    Source: g,
    Name: gg,
    Date: F,
    Time: TT,
    Index: i
  })
})
