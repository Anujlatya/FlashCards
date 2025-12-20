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
  subjectSelect.innerHTML = `<option value="">Select Subject</option>`;
  const snap = await getDocs(collection(db, "subjects"));

  snap.forEach(d => {
    subjectSelect.innerHTML += `<option value="${d.data().name}">
      ${d.data().name}
    </option>`;
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
    coverPreview.innerHTML = `<img src="${coverImage}" />`;
  };
  reader.readAsDataURL(file);
};

/* ================= ADD CARD ================= */
addCardBtn.onclick = () => {
  if (!frontText.value || !backText.value) return;

  cards.push({
    front: frontText.value,
    back: backText.value
  });

  frontText.value = "";
  backText.value = "";
  renderCards();
};

function renderCards() {
  liveCards.innerHTML = "";
  cards.forEach((c, i) => {
    liveCards.innerHTML += `
      <div class="card-preview">
        <b>${c.front}</b> → ${c.back}
        <span onclick="removeCard(${i})">❌</span>
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
  if (!deckTitle.value || !subjectSelect.value || !cards.length) {
    alert("Fill all fields");
    return;
  }

  if (privateCheckbox.checked) {
    const ok = confirm("Are you sure you want to make this deck private?");
    if (!ok) return;
  }

  try {
    // 🔥 CREATE DECK
    const deckRef = await addDoc(collection(db, "decks"), {
      title: deckTitle.value,
      subjects: [subjectSelect.value],
      cover: coverImage,
      userId: currentUser.uid,
      isPublic: !privateCheckbox.checked,

      rating: {
        avg: 0,
        count: 0,
        byUsers: {}
      },
      share:{},
      save:[],
      createdAt: serverTimestamp()
    });

    // 🔥 CREATE CARDS
    for (const card of cards) {
      await addDoc(collection(db, `decks/${deckRef.id}/cards`), {
        front: card.front,
        back: card.back,
        likes:[],
        comment:{},
        save:[],
        share:{},
        createdAt: serverTimestamp()
      });
    }

    alert("Deck created successfully 🎉");
    window.location.href = "/pages/user/userDashboard.html";

  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};
