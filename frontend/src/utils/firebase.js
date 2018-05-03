import {FIREBASE} from "../consts";
import * as firebase from "firebase/app";
import "firebase/database";

const config = {
    apiKey: "AIzaSyD7maFJ1fc_lGPQev9Jiyse53AgtCybpJg",
    authDomain: "smart-github.firebaseapp.com",
    databaseURL: "https://smart-github.firebaseio.com",
    projectId: "smart-github",
    storageBucket: "smart-github.appspot.com",
    messagingSenderId: FIREBASE.SERVER_ID
};
firebase.initializeApp(config);
const database = firebase.database();

export {
    firebase,
    database
};