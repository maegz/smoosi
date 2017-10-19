import firebase from 'firebase';

var config = {
  apiKey: "AIzaSyBhUwE0hzAcq8xiDDVpecIY5dF0r3Tg5Ls",
  authDomain: "smoosi-75f0f.firebaseapp.com",
  databaseURL: "https://smoosi-75f0f.firebaseio.com",
  projectId: "smoosi-75f0f",
  storageBucket: "",
  messagingSenderId: "780795903167"
};
firebase.initializeApp(config);

export default firebase;