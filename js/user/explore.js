import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

import { onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

import { auth, db } from "../firebase/firebaseConfig.js";

/* ELEMENTS */
const results = document.getElementById("results");
const startBtn = document.getElementById("startStudy");
const selectedCount = document.getElementById("selectedCount");
const searchInput = document.getElementById("searchInput");

const openFilter = document.getElementById("openFilter");
const closeFilter = document.getElementById("closeFilter");
const filterDrawer = document.getElementById("filterDrawer");

/* STATE */
let decks = [];
let list = [];
let selected = new Set();
let user = null;
let savedDecks = [];

/* AUTH */
onAuthStateChanged(auth, async (u) => {
  if (!u) return;
  user = u;

  const userSnap = await getDoc(
    doc(db, "users", user.uid)
  );

  savedDecks = userSnap.exists()
    ? userSnap.data().savedDecks || []
    : [];

  loadDecks();
});

/* LOAD DECKS */
async function loadDecks() {
  decks = [];

  const q = query(
    collection(db, "decks"),
    where("isPublic", "==", true)
  );

  const snap = await getDocs(q);

  for (const d of snap.docs) {
    const deck = d.data();
    // console.log(deck)

    const cardsSnap = await getDocs(
      collection(db, `decks/${d.id}/cards`)
    );

    decks.push({
      id: d.id,
      title: deck.title,
      subjects: deck.subjects || [],
      createdAt: deck.createdAt,
      ratingAvg: deck.rating?.avg || 0,
      ratingCount: deck.rating?.count || 0,
      cardsCount: cardsSnap.size,
      cover: deck.cover
    });
  }

  list = [...decks];
  sortRating();
}

/* RENDER */
function render() {
  results.innerHTML = "";

  list.forEach(d => {
    console.log(d)
    const card = document.createElement("div");

    const isSaved = savedDecks.includes(d.id);

    card.className = `
      relative bg-white rounded-2xl shadow hover:shadow-lg transition
      cursor-pointer overflow-hidden border-2
      ${selected.has(d.id) ? "border-indigo-500" : "border-transparent"}
    `;

    card.innerHTML = `
      <!-- SAVE ICON -->
      <button
        class="absolute top-3 right-3 z-10 text-xl
        ${isSaved ? "text-yellow-400" : "text-white"}
        drop-shadow"
        data-save="${d.id}">
        <i class="fas fa-bookmark"></i>
      </button>

      <div class="h-36 bg-cover bg-center"
        style="background-image:url(${d.cover || 'https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=1200'})">
      </div>

      <div class="p-5 space-y-1">
        <h3 class="font-bold truncate">${d.title}</h3>

        <p class="text-sm text-indigo-600">
          ${d.subjects[0] || "General"}
        </p>

        <p class="text-xs text-slate-500">
          ${d.cardsCount} cards
        </p>

        <p class="text-sm text-amber-500 font-semibold">
          ⭐ ${d.ratingAvg.toFixed(1)}
          <span class="text-slate-400 text-xs">
            (${d.ratingCount})
          </span>
        </p>
      </div>
    `;

    /* SELECT FOR STUDY */
    card.onclick = (e) => {
      if (e.target.closest("[data-save]")) return;

      selected.has(d.id)
        ? selected.delete(d.id)
        : selected.add(d.id);

      render();
      updateSelected();
    };

    /* SAVE / UNSAVE */
    card.querySelector("[data-save]").onclick = async (e) => {
      e.stopPropagation();

      const ref = doc(db, "users", user.uid);

      if (isSaved) {
        await updateDoc(ref, {
          savedDecks: arrayRemove(d.id)
        });
        savedDecks = savedDecks.filter(id => id !== d.id);
      } else {
        await updateDoc(ref, {
          savedDecks: arrayUnion(d.id)
        });
        savedDecks.push(d.id);
      }

      render();
    };

    results.appendChild(card);
  });
}

/* SEARCH */
searchInput.oninput = () => {
  const q = searchInput.value.toLowerCase();

  list = decks.filter(d =>
    d.title.toLowerCase().includes(q) ||
    d.subjects.join(",").toLowerCase().includes(q)
  );

  sortRating();
};

/* SORT */
function sortRating() {
  list.sort((a, b) => b.ratingAvg - a.ratingAvg);
  render();
}

function sortRecent() {
  list.sort(
    (a, b) =>
      (b.createdAt?.seconds || 0) -
      (a.createdAt?.seconds || 0)
  );
  render();
}

/* FILTER */
openFilter.onclick = () => {
  filterDrawer.style.right = "0";
};

closeFilter.onclick = () => {
  filterDrawer.style.right = "-300px";
};

document.querySelectorAll("[data-sort]").forEach(btn => {
  btn.onclick = () => {
    btn.dataset.sort === "recent"
      ? sortRecent()
      : sortRating();
  };
});

/* SELECT INFO */
function updateSelected() {
  selectedCount.innerText =
    `${selected.size} decks selected`;

  startBtn.classList.toggle(
    "hidden",
    selected.size === 0
  );
}

/* START STUDY */
startBtn.onclick = () => {
  localStorage.setItem(
    "studyDecks",
    JSON.stringify([...selected])
  );

  window.location.href =
    "/pages/user/studyMode.html";
};
