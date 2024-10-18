// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDjdnkkPMD2PM7X1ilmDa56s4qeluZwX2A",
  authDomain: "aagaaz-fee3f.firebaseapp.com",
  projectId: "aagaaz-fee3f",
  storageBucket: "aagaaz-fee3f.appspot.com",
  messagingSenderId: "974694368221",
  appId: "1:974694368221:web:41552f4cd3c017d33e2c34",
  measurementId: "G-MSEQJN2PJY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };