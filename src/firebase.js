import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

var firebaseConfig = {
  apiKey: "AIzaSyAsvNuSnq0IaSu6JnDzRVqaX-gnhRl6hyc",
  authDomain: "chat-app-df397.firebaseapp.com",
  databaseURL: "https://chat-app-df397.firebaseio.com",
  projectId: "chat-app-df397",
  storageBucket: "chat-app-df397.appspot.com",
  messagingSenderId: "895181809445",
  appId: "1:895181809445:web:e421c6898257e6ed8d5ccc",
  measurementId: "G-QKWRDZDRLC",
};

firebase.initializeApp(firebaseConfig);

export default firebase;
