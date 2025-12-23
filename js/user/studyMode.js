import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

import { onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

import { auth, db } from "../firebase/firebaseConfig.js";
import { requireAuth } from "../auth/authMiddleware.js";

requireAuth(["user"]);

/* ELEMENTS */
const cardInner = document.getElementById("cardInner");
const cardFront = document.getElementById("cardFront");
const cardBack = document.getElementById("cardBack");
const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");

const like = document.getElementById("like");
const likeCount = document.getElementById("likeCount");
// const saveCardBtn = document.getElementById("saveCardBtn");

const commentList = document.getElementById("commentList");
const commentInput = document.getElementById("commentInput");
const postComment = document.getElementById("postComment");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

/* DATA */
const deckId = JSON.parse(localStorage.getItem("studyDecks"))[0];
let user = null;
let cards = [];
let index = 0;
let flipped = false;
let userLiked = false;

/* AUTH */
onAuthStateChanged(auth, async (u) => {
  if (!u) return;
  user = u;
  // console.log(user);
  await loadCards();
});

/* LOAD CARDS */
async function loadCards() {
  cards = [];
  const snap = await getDocs(collection(db, `decks/${deckId}/cards`));
  snap.forEach(d => cards.push({ id: d.id, ...d.data() }));
  showCard();
}

/* SHOW CARD */
function showCard() {
  const c = cards[index];

  cardFront.innerText = c.front;
  cardBack.innerText = c.back;

  cardInner.classList.remove("flipped");
  flipped = false;

  likeCount.innerText = c.likes?.length || 0;

  // like state check
  const liked = c.likes?.includes(user.uid);
  // console.log(liked)

  like.classList.toggle("liked", liked);
  like.innerText = liked ? "❤️" : "🤍";

  progressText.innerText = `${index + 1} / ${cards.length}`;
  progressFill.style.width =
    ((index + 1) / cards.length) * 100 + "%";

  loadComments();
}


/* FLIP */
cardInner.onclick = () => {
  flipped = !flipped;
  cardInner.classList.toggle("flipped", flipped);
};

/* LIKE CARD */
likeBtn.onclick = async () => {
  const c = cards[index];
  const liked = c.likes?.includes(user.uid);
  console.log(liked)

  if (!liked) {
    // LIKE
    await updateDoc(doc(db, `decks/${deckId}/cards/${c.id}`), {
      likes: arrayUnion(user.uid)
    });

    c.likes.push(user.uid); // local update
    // likeCount.innerText++;
  } else {
    // UNLIKE
    await updateDoc(doc(db, `decks/${deckId}/cards/${c.id}`), {
      likes: arrayRemove(user.uid)
    });

    c.likes = c.likes.filter(id => id !== user.uid);
    // likeCount.innerText--;
  }

  // update button UI
  like.classList.toggle("liked", !liked);
  like.innerText = !liked ? "❤️" : "🤍";
};


/* SAVE CARD */
// saveCardBtn.onclick = async () => {
//   const c = cards[index];
//   await updateDoc(doc(db, "users", user.uid), {
//     savedCards: arrayUnion(c.id)
//   });
//   alert("Card saved 💾");
// };

/* COMMENTS */
async function loadComments() {
  commentList.innerHTML = "";
  const c = cards[index];
  const snap = await getDocs(
    collection(db, `decks/${deckId}/cards/${c.id}/comments`)
  );
  snap.forEach(d => {
    commentList.innerHTML += `
      <div class="bg-slate-100 p-2 rounded text-sm">
        ${d.data().text}
      </div>`;
  });
}

postComment.onclick = async () => {
  if (!commentInput.value) {
    alert("Please enter sum text")
    return;
  }
  console.log("Clicked");
  const c = cards[index];
  // await addDoc(
  //   collection(db, `decks/${deckId}/cards/${c.id}/comments`),
  //   {
  //     text: commentInput.value,
  //     userId: user.uid,
  //     createdAt: Date.now()
  //   }
  // );
  console.log(c);
  // commentInput.value = "";
  // loadComments();
};

/* NAV */
nextBtn.onclick = () => {
  if (index < cards.length - 1) {
    index++;
    showCard();
  }
};

prevBtn.onclick = () => {
  if (index > 0) {
    index--;
    showCard();
  }
};
