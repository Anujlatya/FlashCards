import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDwkY2zzFireAk-ZAB2x3_zswDJOSYEbBk",
  authDomain: "fir-5f6f0.firebaseapp.com",
  projectId: "fir-5f6f0",
  storageBucket: "fir-5f6f0.firebasestorage.app",
  messagingSenderId: "23744929552",
  appId: "1:23744929552:web:1a22ebf209d10b4c384f95"
};
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

