// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBYWT4bV4J_11kuPucu5cRS37G6IbXO3Gg",
  authDomain: "expensetracker-c0bfe.firebaseapp.com",
  databaseURL: "https://expensetracker-c0bfe-default-rtdb.firebaseio.com",
  projectId: "expensetracker-c0bfe",
  storageBucket: "expensetracker-c0bfe.appspot.com",
  messagingSenderId: "75446083689",
  appId: "1:75446083689:web:320a4c53c3ab2c3b9082f8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export const database = getDatabase(app);
export const storage = getStorage(app);

export { auth, provider, signInWithPopup, signOut};