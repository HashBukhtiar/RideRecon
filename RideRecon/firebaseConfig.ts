// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAoqaaBiKyaDY22zosBPOdJWgUN7c_CkXg",
  authDomain: "riderecon-2c366.firebaseapp.com",
  projectId: "riderecon-2c366",
  storageBucket: "gs://riderecon-2c366.firebasestorage.app",
  messagingSenderId: "914098900484",
  appId: "1:914098900484:web:d16f52dba9053bbb0e2f51",
  measurementId: "G-RQ1CE4F8XT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);