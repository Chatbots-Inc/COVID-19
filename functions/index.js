// Este código guarda datos en la base de datos realtime firebase.
// La primera parte son requerimientos de Google,
// para acceder a la base de datos, la segunda parte son los datos
// siendo tomados y estilizados un poco. La tercera
// parte es donde se guardan.

// Primera Parte
"use strict";
const DialogflowApp = require("actions-on-google").DialogflowApp;
const functions = require("firebase-functions");
const {WebhookClient} = require("dialogflow-fulfillment");

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require("firebase-admin");
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://covid-19-bjmcqv.firebaseio.com/",
});

exports.covidBotTam = functions.https.onRequest((request, response) => {
  console.log("Dialogflow Request body: " + JSON.stringify(request.body));
  if (request.body.queryResult) {
    processV2Request(request, response);
  } else {
    console.log("Invalid Request");
    return response.status(400).end("Invalid Webhook Request" +
       " (expecting v1 or v2 webhook request)");
  }
});

function processV2Request(request, response) {
  let action = (request.body.queryResult.action) ?
    request.body.queryResult.action : "default";
  const actionHandlers = {
    "default": () => {
      sendResponse("Default Response");
    },
  };

  if (!actionHandlers[action]) {
    action = "default";
  }

  actionHandlers[action]();
  function sendResponse(responseToUser) {
    if (typeof responseToUser === "string") {
      const responseJson = {
        fulfillmentText: responseToUser,
      };
      response.json(responseJson);
    } else {
      const responseJson = {};
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

// Segunda Parte
// Primero tomamos el request, de este objeto JSON salen casi todos los datos.
// Para visualizarlo mejor, puedes ir a
// la consola de Firebase, en la sección de Functions,
// registros y ahí se visualiza lo que se escribe en la consola.
exports.CovidToFirebase = functions.https.onRequest((request, response) => {
  // Escribe en la consola los datos que
  console.log("Request headers: " + JSON.stringify(request.headers));
  // Vamos a extraer
  console.log("Request body: " + JSON.stringify(request.body));

  // Estos son los datos que salen directamente de Dialogflow.
  // Id de respuesta
  let a = JSON.stringify(request.body.responseId);
  // Intent
  let b = JSON.stringify(request.body.queryResult.intent.displayName);
  // Solicitud del usuario
  let c = JSON.stringify(request.body.queryResult.queryText);
  // Parámetro de confianza
  const d = JSON.stringify(request.body.queryResult.intentDetectionConfidence);
  // Id de la sesion
  let e = JSON.stringify(request.body.session);

  // Limpiamos la primera parte de los datos.
  a = a.substring(1);
  b = b.substring(1);
  c = c.substring(1);
  e = e.substring(41);

  // Limpiamos la ultima parte de los datos.
  a = a.slice(0, -1);
  b = b.slice(0, -1);
  c = c.slice(0, -1);
  e = e.slice(0, -1);

  // Función para determinar si un objeto está vacío o no:
  function isEmpty(obj) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  }

  // Función para obtener el índice (número de interacción
  // en esa sesión) del query
  function getIndex(id) {
    let index = 1;
    // Obtiene una referencia de la base de datos (parecido a una copia local)
    const dataRef = admin.database().ref("analytics_ref");
    // Ordena los datos por sesión y busca el último que
    // tenga la misma sesión que este query
    const i = dataRef.orderByChild("SessionId").equalTo(id).limitToLast(1)
        .once("child_added").then(function(snap) {
          index += snap.val().Index;
          console.log("indice adentro: " + index);
          return index;
        });
    console.log("indice afuera: " + index);
    console.log(i);
    return index;
  }

  // Si request.body.originalDetectIntentRequest.payload viene vacío,
  // este mensaje viene directo de Dialogflow
  // Si no viene vacío, este mensaje viene de Telegram.
  if (isEmpty(request.body.originalDetectIntentRequest.payload) === false) {
    var g = JSON.stringify(
        request.body.originalDetectIntentRequest.source); // Fuente
    g = g.substring(1, g.length-1);
    var fg = JSON.stringify(
        request.body.originalDetectIntentRequest
            .payload.data.from.first_name); // Nombre
    fg = fg.substring(1, fg.length-1);
    var lg = JSON.stringify(
        request.body.originalDetectIntentRequest
            .payload.data.from.last_name); // Apellido
    lg = lg.substring(1, lg.length-1);
  } else {
    g = "Dialogflow"; // Fuente
    fg = "No name"; // Nombre
    lg = ""; // Apellido
  }

  const gg = fg + String(" ") + lg; // Nombre y Apellido

  // Para la fecha y hora se utiliza la función Date().
  const f = new Date(); // Tiempo
  const H = f.toLocaleTimeString("de-DE",
      {hour: "2-digit",
        hour12: false,
        timeZone: "America/Mexico_City"}); // Hora local
  const M = f.getMinutes(); // Minutos
  const S = f.getSeconds(); // Segundos
  const DD = f.getDate(); // Dia
  const MM = f.getMonth() + 1; // Mes
  const YY = f.getFullYear(); // Año
  const T = H + ":" + M + ":" + S; // Tiempo
  const F = DD + "/" + MM + "/" + YY; // Fecha
  const TT = f.getTime(); // Milisegundos desde 1/1/1970

  // Obtiene el índice
  const i = getIndex(e);

  // Tercera Parte
  // Se guardan todos los datos en la colección "analytics_ref".
  // Se guardan en orden alfabético. El nombre es lo
  // que está del lado izquierdo y el contenido del lado derecho de ":".
  return admin.database().ref("analytics_ref").push({
    IntentName: b,
    TextQuery: c,
    Confidence: d,
    responseId: a,
    SessionId: e,
    Hour: T,
    Source: g,
    Name: gg,
    Date: F,
    Time: TT,
    Index: i,
  });
});
