// Firebase modülleri
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getDatabase, ref, set, update, push, onValue, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

// Firebase yapılandırması
const firebaseConfig = {
  apiKey: "AIzaSyCICiMDhK5MkQDq4dbV_9jkDMt4n3MUpEg",
  authDomain: "sohbetim-9a9d7.firebaseapp.com",
  databaseURL: "https://sohbetim-9a9d7-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "sohbetim-9a9d7",
  storageBucket: "sohbetim-9a9d7.firebasestorage.app",
  messagingSenderId: "277333150871",
  appId: "1:277333150871:web:d923f8cddb19ec2f672dd2"
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const googleProvider = new GoogleAuthProvider();

// Dışa aktar
export { 
  auth, 
  db,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  onAuthStateChanged,
  signOut,
  ref,
  set,
  update,
  push,
  onValue,
  serverTimestamp
};
