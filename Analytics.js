'use strict';
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');


// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'ws://proyecto-de-prueba-c13b3.firebaseio.com/'
})


exports.ProyectoDePrueba = functions.https.onRequest((request, response) => {
    console.log('Request headers: ' + JSON.stringify(request.headers));
    console.log('Request body: ' + JSON.stringify(request.body));

    var a = JSON.stringify(request.body.responseId);	// Para obtener el id de respuesta
    var b = JSON.stringify(request.body.queryResult.intent.displayName);		// Para obtener el intent
    var c = JSON.stringify(request.body.queryResult.queryText);			// Para obtener la solicitud del usuario
    var d = JSON.stringify(request.body.queryResult.intentDetectionConfidence);	// Para obtener el parámetro de confianza

    // Limpiamos la primera parte de los datos.
    a = a.substring(1);
    b = b.substring(1);
    c = c.substring(1);

    // Limpiamos la ultima parte de los datos.
    a = a.slice(0,-1);
    b = b.slice(0,-1);
    c = c.slice(0,-1);

    return admin.database().ref(a).set({
        IntentName: b,
        TextQuery: c,
        Confidence: d,
    })    
})
