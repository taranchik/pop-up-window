import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyDsUA49kfwP27PHTRimvBFAQtZYYll7G6o",
  authDomain: "iotmodule-44b6c.firebaseapp.com",
  databaseURL: "https://iotmodule-44b6c.firebaseio.com",
  projectId: "iotmodule-44b6c",
  storageBucket: "iotmodule-44b6c.appspot.com",
  messagingSenderId: "195011274265",
  appId: "1:195011274265:web:0581283249f9a6a9d2ec88",
  measurementId: "G-9VR1NVG9GP"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const firestore = firebaseApp.firestore();

export { firestore, firebaseConfig };
