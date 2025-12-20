import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

import { db } from "../firebase/firebaseConfig.js";

export const createDeck = async (deck) => {
  await addDoc(collection(db, "decks"), {
    ...deck,
    createdAt: serverTimestamp(),
    likes: [],
    saves: [],
    comments: []
  });
};
