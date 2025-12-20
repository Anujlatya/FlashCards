import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDp0LoebetCaL9F_q6KLdCua-ghlTkGZz0",
    authDomain: "flashcards-81dba.firebaseapp.com",
    projectId: "flashcards-81dba",
    storageBucket: "flashcards-81dba.firebasestorage.app",
    messagingSenderId: "588713464544",
    appId: "1:588713464544:web:b1ef198e9b5e9e0e7cf685",
    measurementId: "G-ZRVNSKE7RR"
};
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

