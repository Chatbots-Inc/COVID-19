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

    const a = JSON.stringify(request.body.responseId);	// Para obtener el id de respuesta
    const b = JSON.stringify(request.body.queryResult.intent.displayName);		// Para obtener el intent
    const c = JSON.stringify(request.body.queryResult.queryText);			// Para obtener la solicitud del usuario
    const d = JSON.stringify(request.body.queryResult.intentDetectionConfidence);	// Para obtener el parámetro de confianza

    return admin.database().ref(Num).set({
        SessId: a,
        IntentName: b,
        TextQuery: c,
        Confidence: d,
    })    
})
