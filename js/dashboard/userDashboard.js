import { onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

import {
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

import { auth } from "../firebase/firebaseConfig.js";
import { db } from "../firebase/firebaseConfig.js";

const deckList = document.getElementById("deckList");
const totalDecksEl = document.getElementById("totalDecks");
const totalCardsEl = document.getElementById("totalCards");

onAuthStateChanged(auth, async (user) => {
  if (!user) return;
  await loadUserDecks(user.uid);
});

export async function loadUserDecks(uid) {
  if (!deckList || !totalDecksEl || !totalCardsEl) return;

  deckList.innerHTML = "";
  totalDecksEl.textContent = "0";
  totalCardsEl.textContent = "0";

  const q = query(
    collection(db, "decks"),
    where("userId", "==", uid)
  );

  const snapshot = await getDocs(q);

  let deckCount = 0;
  let cardCount = 0;

  for (const docSnap of snapshot.docs) {
    const deck = docSnap.data();
    const deckId = docSnap.id;

    deckCount++;

    const cardsSnap = await getDocs(
      collection(db, `decks/${deckId}/cards`)
    );

    const cardsLength = cardsSnap.size;
    cardCount += cardsLength;

    deckList.innerHTML += `
      <div class="deck-card">
        <h3>${deck.title}</h3>
        <p class="subject">${deck.subjects?.join(", ") || "N/A"}</p>
        <p>${cardsLength} cards</p>
        <span class="visibility ${deck.isPublic ? "public" : "private"}">
          ${deck.isPublic ? "Public" : "Private"}
        </span>
      </div>
    `;
  }

  totalDecksEl.textContent = deckCount;
  totalCardsEl.textContent = cardCount;

  if (deckCount === 0) {
    deckList.innerHTML = `<p>No decks created yet.</p>`;
  }
}
