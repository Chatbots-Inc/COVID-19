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

// wrapper para obtener los datos de un intervalo de tiempo
function getRangeData(start, stop, sortBy = 'Time') {
  return getArrayFromQuery(usersRef.orderByChild(sortBy).startAt(start).endAt(stop));
}

// función para obtener una lista con los valores de un child
// (por ejemplo. una lista con todos los nombres de usuario)
export function getChildValues(childName) {
  var data = [];
  var prevChildValue;
  usersRef.orderByChild(childName).on("child_added", function(snapshot) {
    var childValue = snapshot.val()[childName];
    if (!(childValue == prevChildValue)) {
      data.push(childValue);
      prevChildValue = childValue;
    }
  });
  console.log(data);
  return data
}

// wrapper para obtener todos los datos de una lista de valores
// (por ejemplo, todas las interacciones de ciertos usuarios)
function getChildrenFromValues(childName, values) {
  var children = [];
  console.log('childname: ' + childName + ' values: ' + values);
  values.forEach(function(value) {
    var matches = usersRef.orderByChild(childName).equalTo(value);
    matches = getArrayFromQuery(matches);
    console.log(matches);
    children = children.concat(matches);
  });
  console.log(children);
  return children;
}

// función para obtener una lista con los datos de uno o más queries
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

// función para obtener los datos según distintos filtros
export function getFilteredData(sortBy, startTime, stopTime, nameList) {
  var data = getArrayFromQuery(usersRef);
  // filtro por tiempo
  if (sortBy == 'Time') {
    // args tiene el principio y el final
    data = getRangeData(startTime, stopTime);
  // filtro por nombre de usuario
  } else if (sortBy == 'Name') {
    console.log('name filter');
    data = getChildrenFromValues(sortBy, nameList);
  }
  // si no hay filtros se queda igual
  return data; 
}

// nombres de los campos de la base de datos para exportar
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
