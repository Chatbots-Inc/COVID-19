import { initializeApp } from 'firebase';

// hace una instancia de aoo para comunicarse con firebase
const app = initializeApp({
  apiKey: "AIzaSyBChigHV8ZdXiE5RNz4BwpLPsc4UD3Mmyg",
  authDomain: "covid-19-bjmcqv.firebaseapp.com",
  databaseURL: "https://covid-19-bjmcqv.firebaseio.com",
  projectId: "covid-19-bjmcqv",
  storageBucket: "covid-19-bjmcqv.appspot.com",
  messagingSenderId: "859229292547",
  appId: "1:859229292547:web:09c455911406d0c5f9a636"
});

// obtiene la base de datos de firebase
export const db = app.database();
export const usersRef = db.ref('analytics_ref');

// función para obtener una lista con los datos de un query
function getArrayFromQuery(query) {
  var data;
  // obtiene objeto con los datos del query
  query.on("value", function(snapshot) {
    data = snapshot.exportVal()
  });
  // mapea el objeto a una lista con solamente los valores
  data = $.map(data, function(val, index) {
    return val
  });
  return data
}

// función para obtener los datos de un intervalo de tiempo
function getRangeData(start, stop, sortBy = 'Time') {
  console.log('start: ' + start + ' stop: ' + stop);
  var data = usersRef.orderByChild(sortBy).startAt(start).endAt(stop);
  return data
}

// función para obtener los datos según distintos filtros
export function getFilteredData(sortBy, args) {
  var data = usersRef;
  // filtro por tiempo
  if (sortBy == 'Time') {
    console.log('time filter');
    // args tiene el principio y el final
    data = getRangeData(args[0], args[1]);
  // filtro por nombre de usuario
  } else if (sortBy == 'Name') {
    // TODO: cambiar para que sí sea un filtro
    console.log('name filter');
  }

  // obtener lista de datos a partir del query
  return getArrayFromQuery(data); 
}

// nombres de los datos de la base de datos para exportar
export const exportFields = {
  'No. sesión': 'SessionId',
  'Nombre de usuario': 'Name',
  'Fecha': 'Date',
  'Hora': 'Hour',
  'No. interacción': 'index',
  'Escrito usuario': 'TextQuery',
  'Escrito agente': 'IntentName',
  'Certidumbre': 'Confidence'
};

export const errorMessages = {
  'auth/wrong-password': 'Contraseña incorrecta',
  'auth/invalid-email': 'Formato de correo incorrecto',
  'auth/email-already-in-use': 'Correo ya en uso',
  'auth/network-request-failed': 'No estas conectado a la red',
};
