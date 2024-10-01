// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCWlPXeDXWfV4rn9sQUblmCn7rs6fJEn28",
  authDomain: "expensetracker2-8677e.firebaseapp.com",
  databaseURL: "https://expensetracker2-8677e-default-rtdb.firebaseio.com",
  projectId: "expensetracker2-8677e",
  storageBucket: "expensetracker2-8677e.appspot.com",
  messagingSenderId: "274150867022",
  appId: "1:274150867022:web:a09c55847155b39913031f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export const database = getDatabase(app);

export { auth, provider, signInWithPopup}
;