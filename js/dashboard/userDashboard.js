import { onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

import {
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

import { auth, db } from "../firebase/firebaseConfig.js";

/* ELEMENTS */
const deckList = document.getElementById("deckList");
const totalDecksEl = document.getElementById("totalDecks");
const totalCardsEl = document.getElementById("totalCards");
const studyBar = document.getElementById("studyBar");
const selectedCountEl = document.getElementById("selectedCount");
const startStudyBtn = document.getElementById("startStudy");

/* STATE */
let selectedDecks = {};
let totalDecks = 0;
let totalCards = 0;

/* AUTH */
onAuthStateChanged(auth, async (user) => {
  if (!user) return;
  loadUserDecks(user.uid);
});

/* LOAD USER DECKS */
async function loadUserDecks(uid) {
  deckList.innerHTML = "";
  selectedDecks = {};
  totalDecks = 0;
  totalCards = 0;

  const q = query(
    collection(db, "decks"),
    where("userId", "==", uid)
  );

  const snapshot = await getDocs(q);

  for (const docSnap of snapshot.docs) {
    const deck = docSnap.data();
    const deckId = docSnap.id;

    totalDecks++;

    // const cardsSnap = await getDocs(
    //   collection(db, `decks/${deckId}/cards`)
    // );

    const cardsLength = deck.cardCount;
    totalCards += cardsLength;

    const coverImage =
      deck.cover ||
      "https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=1200";

    deckList.innerHTML += `
      <div 
        class="deck-card bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden cursor-pointer border-2 border-transparent"
        data-id="${deckId}"
        data-cards="${cardsLength}"
      >
        <div class="h-36 bg-cover bg-center" style="background-image:url('${coverImage}')"></div>

        <div class="p-5 space-y-2">
          <h3 class="font-bold truncate">${deck.title}</h3>

          <p class="text-sm text-slate-500">
            ${deck.subjects?.join(", ") || "N/A"}
          </p>

          <p class="text-xs text-slate-400">${cardsLength} cards</p>

          <span class="inline-block text-xs px-2 py-1 rounded ${
            deck.isPublic
              ? "bg-emerald-100 text-emerald-700"
              : "bg-red-100 text-red-700"
          }">
            ${deck.isPublic ? "Public" : "Private"}
          </span>
        </div>
      </div>
    `;
  }

  totalDecksEl.innerText = totalDecks;
  totalCardsEl.innerText = totalCards;

  if (totalDecks === 0) {
    deckList.innerHTML =
      `<p class="text-slate-500">No decks created yet.</p>`;
  }
}

/* SELECT / DESELECT DECK */
deckList.onclick = (e) => {
  const card = e.target.closest(".deck-card");
  if (!card) return;

  const deckId = card.dataset.id;
  const cards = Number(card.dataset.cards);

  if (selectedDecks[deckId]) {
    delete selectedDecks[deckId];
    card.classList.remove("border-blue-500");
  } else {
    selectedDecks[deckId] = cards;
    card.classList.add("border-blue-500");
  }

  updateStudyBar();
};

/* UPDATE STUDY BAR */
function updateStudyBar() {
  const deckIds = Object.keys(selectedDecks);

  if (!deckIds.length) {
    studyBar.classList.add("hidden");
    return;
  }

  const totalSelectedCards = Object.values(selectedDecks)
    .reduce((a, b) => a + b, 0);

  selectedCountEl.innerText =
    `${totalSelectedCards} cards selected`;

  studyBar.classList.remove("hidden");
}

/* START STUDY */
startStudyBtn.onclick = () => {
  const deckIds = Object.keys(selectedDecks);

  if (!deckIds.length) {
    alert("Select at least one deck");
    return;
  }

  localStorage.setItem(
    "studyDecks",
    JSON.stringify(deckIds)
  );

  window.location.href =
    "/pages/user/studyMode.html";
};
