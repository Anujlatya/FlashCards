import { onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

import { auth, db } from "../firebase/firebaseConfig.js";

/* ================= ELEMENTS ================= */
const subjectSelect = document.getElementById("subjectSelect");
const coverInput = document.getElementById("coverInput");
const coverPreview = document.getElementById("coverPreview");
const addCardBtn = document.getElementById("addCard");
const createDeckBtn = document.getElementById("createDeckBtn");
const liveCards = document.getElementById("liveCards");

const deckTitle = document.getElementById("deckTitle");
const frontText = document.getElementById("frontText");
const backText = document.getElementById("backText");
const privateCheckbox = document.getElementById("private");

/* ================= STATE ================= */
let coverImage = "";
let cards = [];
let currentUser = null;

/* ================= AUTH ================= */
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "/pages/index.html";
    return;
  }
  currentUser = user;
  await loadSubjects();
});

/* ================= SUBJECTS ================= */
async function loadSubjects() {
  subjectSelect.innerHTML =
    `<option value="">Select subject</option>`;

  const snap = await getDocs(collection(db, "subjects"));

  snap.forEach(d => {
    subjectSelect.innerHTML += `
      <option value="${d.data().name}">
        ${d.data().name}
      </option>
    `;
  });
}

/* ================= COVER ================= */
coverPreview.onclick = () => coverInput.click();

coverInput.onchange = () => {
  const file = coverInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    coverImage = reader.result;
    coverPreview.innerHTML = `
      <img src="${coverImage}"
        class="w-full h-full object-cover rounded-2xl" />
    `;
  };
  reader.readAsDataURL(file);
};

/* ================= ADD CARD ================= */
addCardBtn.onclick = () => {
  const front = frontText.value.trim();
  const back = backText.value.trim();

  if (!front || !back) return;

  cards.push({ front, back });

  frontText.value = "";
  backText.value = "";
  renderCards();
};

function renderCards() {
  liveCards.innerHTML = "";

  cards.forEach((c, i) => {
    liveCards.innerHTML += `
      <div class="bg-slate-100 rounded-xl p-4 relative">
        <button
          class="absolute top-2 right-2 text-red-500 text-sm"
          onclick="removeCard(${i})">✕</button>

        <p class="font-semibold text-slate-700">
          ${c.front}
        </p>
        <p class="text-slate-500 text-sm mt-1">
          ${c.back}
        </p>
      </div>
    `;
  });
}

window.removeCard = (i) => {
  cards.splice(i, 1);
  renderCards();
};

/* ================= CREATE DECK ================= */
createDeckBtn.onclick = async () => {
  const title = deckTitle.value.trim();
  const subject = subjectSelect.value;

  if (!title || !subject || !cards.length) {
    alert("Please fill all fields");
    return;
  }

  if (privateCheckbox.checked) {
    const ok = confirm("Are you sure you want to make this deck private?");
    if (!ok) return;
  }

  createDeckBtn.disabled = true;
  createDeckBtn.innerText = "Creating...";

  try {
    /* 🔥 CREATE DECK */
    const deckRef = await addDoc(collection(db, "decks"), {
      title,
      subjects: [subject],
      cover: coverImage || "", // default empty
      userId: currentUser.uid,
      isPublic: !privateCheckbox.checked,

      rating: {
        avg: 0,
        count: 0,
        byUsers: {}
      },

      cardCount: cards.length, // ✅ IMPORTANT
      share: {},
      save: [],
      createdAt: serverTimestamp()
    });

    /* 🔥 CREATE CARDS */
    for (const card of cards) {
      await addDoc(
        collection(db, `decks/${deckRef.id}/cards`),
        {
          front: card.front,
          back: card.back,
          createdAt: serverTimestamp(),
          likes: [],
          share: {},
          comment: {},
          save: []
        }
      );
    }

    alert("Deck created successfully 🎉");
    window.location.href =
      "/pages/user/userDashboard.html";

  } catch (err) {
    console.error(err);
    alert(err.message);
  } finally {
    createDeckBtn.disabled = false;
    createDeckBtn.innerText = "Save Deck";
  }
};
