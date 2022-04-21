import firebase from 'firebase';
import "firebase/storage";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAqGV4rv8kx3oiqeLPK5uxkW_-zvN9sAGg",
    authDomain: "voucherhunt-c8a48.firebaseapp.com",
    databaseURL: "https://voucherhunt-c8a48.firebaseio.com",
    projectId: "voucherhunt-c8a48",
    storageBucket: "voucherhunt-c8a48.appspot.com",
    messagingSenderId: "431014861174",
    appId: "1:431014861174:web:6a5aeb53090ba11a124257",
    measurementId: "G-E64VQM00FG"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//firebase.analytics();

const storage = firebase.storage();
const auth = firebase.auth();


export {storage, auth, firebase as default};



