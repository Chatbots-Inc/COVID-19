'use strict';
const DialogflowApp = require('actions-on-google').DialogflowApp,
functions = require('firebase-functions');

exports.dialectBot = functions.https.onRequest((request, response) => {
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




