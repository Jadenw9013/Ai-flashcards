// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore}  from "firebase/firestore"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAz619yPhJJeKCJ7zThKQNM-l7G7ZcqEEw",
  authDomain: "flashcardsaas-299a9.firebaseapp.com",
  projectId: "flashcardsaas-299a9",
  storageBucket: "flashcardsaas-299a9.appspot.com",
  messagingSenderId: "324817914588",
  appId: "1:324817914588:web:71f666baa454a9a4020219",
  measurementId: "G-6LHSS48D19"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

export { db }