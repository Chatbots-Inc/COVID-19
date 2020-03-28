
// import  basic modules
const functions = require('firebase-functions');
const {
 dialogflow,
 SimpleResponse,
 BasicCard,
 Button,
 Image,
 Table,
 Carousel,
 List,
 Suggestions,
} = require('actions-on-google');

// firebase real time database
var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://chatbotsi-intets-especificos.firebaseio.com"
});
var db = admin.database();

// declare dialoglow conversation handler
const app = dialogflow({
    debug: true,
    clientId: '65708101491-d7h7cvrsgdeea5oc1bvl1mmd6s36flh4.apps.googleusercontent.com'
});

// convenient intent suggestions
const actionSuggestions = [
    'Definición',
    'Tutorial',
    'Video',
    'Algoritmo'
    // 'Comparación',
];

const conceptSuggestions = [
    'BFS',
    'DFS',
    'Greedy',
    'UCS',
    'A*',
    'Alpinista'
];

// this belongs to the database
const list_of_available_actions = db.ref('props/list_of_available_actions/');
const list_of_concepts = db.ref('props/list_of_concepts/');
const concepts = db.ref('contenido/conceptos/');


//////////////////////// INTENTS ////////////////////////////////////////////

// INTENT: just say hi and show intent suggestions
app.intent('Default Welcome Intent', (conv) => {
    conv.ask(new SimpleResponse({
        speech: '¡Hola!',
        text: '¡Hola! Soy el chatbot de sistemas inteligentes, hazme alguna pregunta o simplemente pregúntame qué puedo hacer'
    }));
    conv.ask(new Suggestions(['¿Qué puedes hacer?', 'Qué es BFS?', 'Algoritmo a estrella']));
});

// INTENT: directly delivers the algorithm of a concept
app.intent('action_algorithm_direct', (conv, params) => {
  // set action context
  conv.contexts.set('action_context', 5, {'action': 'CONCEPT_ALGORITHM'});
  let response = '';
  let concept = params.concepts;
  // set concept context
  conv.contexts.set('concept_context', 5, {'concept': concept});
  return concepts.once('value')
    .then(result => {
        if (concept) {
            let algorithm = result.val()[concept]['descripcion_algoritmo'];
            let concept_lwr = concept.toLowerCase();
            if (algorithm) {
                response = algorithm;
                conv.ask(`Este es el algoritmo de ${concept_lwr}:`);
            } else {
                conv.ask(`Lo siento, no conozco el algoritmo de ${concept_lwr}`);
            }
            conv.ask(new BasicCard({
                text: response,
                title: concept,
                image: new Image({
                    url: result.val()[concept]['algoritmo'],
                    alt: 'Imagen del algoritmo'
                })
            }));
            return conv.ask(new Suggestions(actionSuggestions));
        } else {
            conv.ask('Lo siento, no conozco ese algoritmo, pero te puedo sugerir algunos que sí...');
            return conv.ask(new Suggestions(conceptSuggestions));
        }
    }).catch(err => {
        console.error(err);
        return conv.close('Sorry, problems with this intent');
    });
});

// INTENT: directly delivers the definition of a concept
app.intent('action_definition_direct', (conv, params) => {
  // set action context
  conv.contexts.set('action_context', 5, {'action': 'CONCEPT_DEFINITION'});
  let response = '';
  let concept = params.concepts;
  // set concept context
  conv.contexts.set('concept_context', 5, {'concept': concept});
  return concepts.once('value')
    .then(result => {
        if (concept) {
            let definition = result.val()[concept]['definicion'];
            let concept_lwr = concept.toLowerCase();
            if (definition) {
                response = definition;
                conv.ask(`Esta es la definición de ${concept_lwr}:`);
            } else {
                conv.ask(`Lo siento, no conozco la definición de ${concept_lwr}`);
            }
            conv.ask(new BasicCard({
                text: response,
                title: concept,
                image: new Image({
                    url: result.val()[concept]['imagen'],
                    alt: 'Imagen del concepto'
                })
            }));
            return conv.ask(new Suggestions(actionSuggestions));
        } else {
            conv.ask('Lo siento, no conozco esa definición, pero te puedo sugerir algunas que sí...');
            return conv.ask(new Suggestions(conceptSuggestions));
        }
    }).catch(err => {
        console.error(err);
        return conv.close('Sorry, problems with this intent');
    });
});

// INTENT: directly starts the tutorial of a concept also mentioned by user
app.intent('action_tutorial_direct', (conv, params) => {
  // set action context
  conv.contexts.set('action_context', 5, {'action': 'CONCEPT_TUTORIAL'});
  let response = '';
  let concept = params.concepts;
  // set concept context
  conv.contexts.set('concept_context', 5, {'concept': concept});
  // go fetch its tutorial
  switch (concept) {
    case 'Busqueda A*':
        conv.followup('EVENT_ASTAR');
        break;
    case 'Busqueda de Alpinista':
        conv.followup('EVENT_ALPS');
        break;
    case 'Busqueda costo uniforme':
        conv.followup('EVENT_NUCS');
        break;
    case 'Busqueda en anchura':
        conv.followup('EVENT_BFS');
        break;
    case 'Busqueda Greedy':
        conv.followup('EVENT_GREEDY');
        break;
    case 'Busqueda en profundidad':
        conv.followup('EVENT_DFS');
        break;
    default:
        conv.ask('Lo siento, no tengo el tutorial de ese concepto, pero te puedo sugerir algunos que sí...');
        conv.ask(new Suggestions(conceptSuggestions));
  }
});

// INTENT: display a list of available actions
app.intent('actions_available', (conv) => {
  let response = 'Esta es una lista de las acciones que puedo realizar.';
  conv.ask(new SimpleResponse({
      speech: response,
      text: response
  }));
  // Read list format from reference to the database
  return list_of_available_actions.once('value')
      .then(result => {
          // create new list with the result promise object
          return conv.ask(new List(result.val()));
      }).catch(err => {
          console.error(err);
          return conv.close('Sorry, problems');
      });
});

// INTENT: handle option selected from 'actions_available'
app.intent('option_handler', (conv, params, option) => {
  // Get the user's selection
  // Compare the user's selections to each of the item's keys
  let response = 'No seleccionaste ninguna opción';
  if (!option) {
    response = 'No seleccionaste ninguna opción';
  } else if (option === 'DEFINITION') {
    conv.followup('EVENT_DEFINITION');
  } else if (option === 'TUTORIAL') {
    conv.followup('EVENT_TUTORIAL');
  } else if (option === 'VIDEO') {
    conv.followup('EVENT_VIDEO');
  } else if (option === 'ALGORITHM') {
    conv.followup('EVENT_ALGORITHM');
  } else if (option === 'COMPARISON') {
    conv.followup('EVENT_COMPARISON');
  } else {
  // I am assuming the option selected was a concept
    response = 'No se identificó el concepto o la acción.';
    conv.contexts.set('concept_context', 5, {'concept': option});
    let ACTION = conv.contexts.get('action_context')['parameters']['action'];
    conv.followup('EVENT_' + ACTION);
  }
  conv.ask(new SimpleResponse({
      speech: response,
      text: response
  }));
});

// INTENT: display a list 5 sample terms that have definition
app.intent('new_definition', (conv) => {
  // set action context
  conv.contexts.set('action_context', 5, {'action': 'CONCEPT_DEFINITION'});
  // if there already existed a concept as a context variable
  if (conv.contexts.get('concept_context')) {
        concept = conv.contexts.get('concept_context')['parameters']['concept'];
        conv.followup('EVENT_CONCEPT_DEFINITION'); // call new_definition - get_concept
  }
  // simple response
  let response = 'Esta es una lista de términos que puedo definir.';
  conv.ask(new SimpleResponse({
      speech: response,
      text: response
  }));
  // Read list format from reference to the database
  return list_of_concepts.once('value')
      .then(result => {
          // create new list with the result promise object
          return conv.ask(new List(result.val()));
      }).catch(err => {
          console.error(err);
          return conv.close('Sorry, problems');
      });
});

// INTENT: define concept
app.intent('new_definition - get_concept', (conv, params) => {
    let concept = "not set";
    if (conv.contexts.get('concept_context')) {
        concept = conv.contexts.get('concept_context')['parameters']['concept'];
    } else {
        concept = params.concepts;
        // set concept context
        conv.contexts.set('concept_context', 5, {'concept': concept});
    }
    // go fetch its definition
    return concepts.once('value')
    .then(result => {
        if (concept) {
            let definition = result.val()[concept]['definicion'];
            let concept_lwr = concept.toLowerCase();
            if (definition) {
                response = definition;
                conv.ask(`Esta es la definición de ${concept_lwr}:`);
            } else {
                conv.ask(`Lo siento, no conozco la definición de ${concept_lwr}`);
            }
            conv.ask(new BasicCard({
                text: response,
                title: concept,
                image: new Image({
                    url: result.val()[concept]['imagen'],
                    alt: 'Imagen del concepto'
                })
            }));
            return conv.ask(new Suggestions(actionSuggestions));
        } else {
            conv.ask('Lo siento, no conozco esa definición, pero te puedo sugerir algunas que sí...');
            return conv.ask(new Suggestions(conceptSuggestions));
        }
    }).catch(err => {
        console.error(err);
        return conv.close('Sorry, problems with this intent');
    });
});

// INTENT: display concepts that have a tutorial available
app.intent('new_tutorial', (conv) => {
    // En el futuro sugerir tutoriales populares a través de un carrusel
    // set action context
    conv.contexts.set('action_context', 5, {'action': 'CONCEPT_TUTORIAL'});
    // if there already existed a concept as a context variable
    if (conv.contexts.get('concept_context')) {
            concept = conv.contexts.get('concept_context')['parameters']['concept'];
            conv.followup('EVENT_CONCEPT_TUTORIAL'); // call new_definition - get_concept
    }
    // simple response
    let response = 'Estos son los tutoriales disponibles.';
    conv.ask(new SimpleResponse({
        speech: response,
        text: response
    }));
    // Read list format from reference to the database
    return list_of_concepts.once('value')
        .then(result => {
            // create new list with the result promise object
            return conv.ask(new List(result.val()));
        }).catch(err => {
            console.error(err);
            return conv.close('Sorry, problems');
        });
});

// INTENT: show concept tutorial
app.intent('new_tutorial - get_concept', (conv, params) => {
    let concept = "not set";
    if (conv.contexts.get('concept_context')) {
        concept = conv.contexts.get('concept_context')['parameters']['concept'];
    } else {
        concept = params.concepts;
        // set concept context
        conv.contexts.set('concept_context', 5, {'concept': concept});
    }
    // go fetch its tutorial
    switch (concept) {
        case 'Busqueda A*':
            conv.followup('EVENT_ASTAR');
            break;
        case 'Busqueda de Alpinista':
            conv.followup('EVENT_ALPS');
            break;
        case 'Busqueda costo uniforme':
            conv.followup('EVENT_NUCS');
            break;
        case 'Busqueda en anchura':
            conv.followup('EVENT_BFS');
            break;
        case 'Busqueda Greedy':
            conv.followup('EVENT_GREEDY');
            break;
        case 'Busqueda en profundidad':
            conv.followup('EVENT_DFS');
            break;
        default:
            conv.ask('Lo siento, no tengo el tutorial de ese concepto, pero te puedo sugerir algunos que sí...');
            conv.ask(new Suggestions(conceptSuggestions));
    }
});

// INTENT: show concepts with videos
app.intent('new_video', (conv) => {
    // Estos son los videos más populares (incluir media response)...
    // set action context
    conv.contexts.set('action_context', 5, {'action': 'CONCEPT_VIDEO'});
    // if there already existed a concept as a context variable
    if (conv.contexts.get('concept_context')) {
            concept = conv.contexts.get('concept_context')['parameters']['concept'];
            conv.followup('EVENT_CONCEPT_VIDEO'); // call new_definition - get_concept
    }
    // simple response
    let response = 'Esta es una lista de los términos que tienen un video.';
    conv.ask(new SimpleResponse({
        speech: response,
        text: response
    }));
    // Read list format from reference to the database
    return list_of_concepts.once('value')
        .then(result => {
            // create new list with the result promise object
            return conv.ask(new List(result.val()));
        }).catch(err => {
            console.error(err);
            return conv.close('Sorry, problems');
        });
});

// INTENT: video of concept
app.intent('new_video - get_concept', (conv, params) => {
    let concept = "not set";
    if (conv.contexts.get('concept_context') !== undefined) {
        concept = conv.contexts.get('concept_context')['parameters']['concept'];
    } else {
        concept = params.concepts;
        // set concept context
        conv.contexts.set('concept_context', 5, {'concept': concept});
    }
    // go fetch its video
    return concepts.once('value')
      .then(result => {
        if (concept) {
            let video = result.val()[concept]['video'];
            let concept_lwr = concept.toLowerCase();
            if (video) {
                response = video;
                conv.ask(`Este es el video de ${concept_lwr}:`);
            } else {
                conv.ask(`Lo siento, no tengo el video de ${concept_lwr}`);
            }
            conv.ask(new BasicCard({
                title: concept,
                buttons: new Button({
                    title: 'Ver en Youtube',
                    url: response
                }),
                image: new Image({
                    url: result.val()[concept]['imagen'],
                    alt: 'Imagen del concepto'
                })
            }));
            return conv.ask(new Suggestions(actionSuggestions));
        } else {
            conv.ask('Lo siento, no tengo ese video, pero te puedo sugerir algunos que sí...');
            return conv.ask(new Suggestions(conceptSuggestions));
        }
    }).catch(err => {
        console.error(err);
        return conv.close('Sorry, problems with this intent');
    });
});

// INTENT: show concepts with available algorithms
app.intent('new_algorithm', (conv) => {
    // Mostrando sugerencias de algoritmos populares
    // set action context
    conv.contexts.set('action_context', 5, {'action': 'CONCEPT_ALGORITHM'});
    // if there already existed a concept as a context variable
    if (conv.contexts.get('concept_context')) {
            concept = conv.contexts.get('concept_context')['parameters']['concept'];
            conv.followup('EVENT_CONCEPT_ALGORITHM'); // call new_definition - get_concept
    }
    // simple response
    let response = 'Esta es una lista de los algoritmos que puedo mostrarte.';
    conv.ask(new SimpleResponse({
        speech: response,
        text: response
    }));
    // Read list format from reference to the database
    return list_of_concepts.once('value')
        .then(result => {
            // create new list with the result promise object
            return conv.ask(new List(result.val()));
        }).catch(err => {
            console.error(err);
            return conv.close('Sorry, problems');
        });
});

// INTENT: give algorithm from context instead of extracting parameter
app.intent('new_algorithm - get_concept', (conv, params) => {
    let response = '';
    let concept = "not set";
    if (conv.contexts.get('concept_context') !== undefined) {
        concept = conv.contexts.get('concept_context')['parameters']['concept'];
    } else {
        concept = params.concepts;
        // set concept context
        conv.contexts.set('concept_context', 5, {'concept': concept});
    }
    // go fetch its definition
    return concepts.once('value')
    .then(result => {
        if (concept) {
            let algorithm = result.val()[concept]['descripcion_algoritmo'];
            let concept_lwr = concept.toLowerCase();
            if (algorithm) {
                response = algorithm;
                conv.ask(`Este es el algoritmo de ${concept_lwr}:`);
            } else {
                conv.ask(`Lo siento, no conozco el algoritmo de ${concept_lwr}`);
            }
            conv.ask(new BasicCard({
                text: response,
                title: concept,
                image: new Image({
                    url: result.val()[concept]['algoritmo'],
                    alt: 'Imagen del algoritmo'
                })
            }));
            return conv.ask(new Suggestions(actionSuggestions));
        } else {
            conv.ask('Lo siento no, conozco ese algoritmo, pero te puedo sugerir algunos que sí...');
            return conv.ask(new Suggestions(conceptSuggestions));
        }
    }).catch(err => {
        console.error(err);
        return conv.close('Sorry, problems with this intent');
    });
});

///////////////////////// EXPORT APP ///////////////////////////////////

exports.fulfillment = functions.https.onRequest(app);
