// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC100Pw1LME3JbxEEGQKqHu3bhfu9Mg87c",
  authDomain: "finance-tracker-ed674.firebaseapp.com",
  projectId: "finance-tracker-ed674",
  storageBucket: "finance-tracker-ed674.firebasestorage.app",
  messagingSenderId: "1033855716891",
  appId: "1:1033855716891:web:eff446d09f34d1051132be",
  measurementId: "G-DHXLR0JR83"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export {db, auth, provider, doc, setDoc};