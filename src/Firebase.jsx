// Firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut} from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC4cpwWNTn_ew16AXGIlldW3JbaCQ8eYhs",
  authDomain: "expensetracker-b712a.firebaseapp.com",
  databaseURL: "https://expensetracker-b712a-default-rtdb.firebaseio.com",
  projectId: "expensetracker-b712a",
  storageBucket: "expensetracker-b712a.firebasestorage.app",
  messagingSenderId: "279100280283",
  appId: "1:279100280283:web:7b8708df66fef6cacd6bfe"
};


// Initialize Firebase and export instances
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const database = getDatabase(app);
const storage = getStorage(app);

export { auth, provider, signInWithPopup, signOut, database, storage };
