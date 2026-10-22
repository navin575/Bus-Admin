import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAWLmA5xVE2tKXsZ11W22sO__s1jSmklKI",
  authDomain: "tnstc-smart-transit.firebaseapp.com",
  databaseURL: "https://tnstc-smart-transit-default-rtdb.firebaseio.com",
  projectId: "tnstc-smart-transit",
  storageBucket: "tnstc-smart-transit.firebasestorage.app",
  messagingSenderId: "677760252988",
  appId: "1:677760252988:web:55d71d77e699d5614a5739",
  measurementId: "G-XE1JMBR9VE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore
export const db = getFirestore(app);
