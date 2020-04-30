import { initializeApp } from 'firebase';

const app = initializeApp({
  apiKey: "AIzaSyBChigHV8ZdXiE5RNz4BwpLPsc4UD3Mmyg",
  authDomain: "covid-19-bjmcqv.firebaseapp.com",
  databaseURL: "https://covid-19-bjmcqv.firebaseio.com",
  projectId: "covid-19-bjmcqv",
  storageBucket: "covid-19-bjmcqv.appspot.com",
  messagingSenderId: "859229292547",
  appId: "1:859229292547:web:09c455911406d0c5f9a636"
});

export const db = app.database();
export const usersRef = db.ref('analytics_ref');

export const errorMessages = {
  'auth/wrong-password': 'Contraseña incorrecta',
  'auth/invalid-email': 'Formato de correo incorrecto',
  'auth/email-already-in-use': 'Correo ya en uso',
  'auth/network-request-failed': 'No estas conectado a la red',
};
