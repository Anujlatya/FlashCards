import { onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

import { requireAuth } from "../auth/authMiddleware.js";
requireAuth(["user"])

import { auth, db } from "../firebase/firebaseConfig.js";

const grid = document.getElementById("savedGrid");

onAuthStateChanged(auth, async (user) => {
  if (!user) return;

  const userSnap = await getDoc(doc(db, "users", user.uid));
  const saved = userSnap.data()?.savedDecks || [];

  if (!saved.length) {
    grid.innerHTML = `<p class="text-slate-500">No saved decks yet.</p>`;
    return;
  }

  for (const deckId of saved) {
    const dSnap = await getDoc(doc(db, "decks", deckId));
    if (!dSnap.exists()) continue;

    const d = dSnap.data();
    console.log(d)
    // console.log(d.cover)
    console.log(d.title)
    console.log(d.cardCount)

    grid.innerHTML += `
      <div class="bg-white rounded-2xl shadow hover:shadow-lg transition">
        <img src="${d.cover || 'https://images.unsplash.com/photo-1513258496099-48168024aec0'}"
             class="h-36 w-full object-cover rounded-t-2xl"/>
        <div class="p-4">
          <h3 class="font-bold">${d.title}</h3>
          <p class="text-sm text-slate-500">${d.cardCount || 0} cards</p>
        </div>
      </div>
    `;
  }
});
