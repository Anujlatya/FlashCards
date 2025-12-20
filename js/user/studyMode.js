let cards = JSON.parse(localStorage.getItem("studyCards")) || [
    { front: "Sample Question?", back: "Sample Answer" }
];

cards = cards.sort(() => Math.random() - 0.5);

let index = 0;
let flipped = false;

const flashcard = document.getElementById("flashcard");
const front = document.getElementById("cardFront");
const back = document.getElementById("cardBack");
const progress = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");

function show() {
    front.innerText = cards[index].front;
    back.innerText = cards[index].back;
    flashcard.classList.remove("flipped");
    flipped = false;
    progress.style.width = ((index + 1) / cards.length) * 100 + "%";
    progressText.innerText = `${index + 1} / ${cards.length}`;
}
show();

/* FLIP */
flashcard.onclick = () => {
    flashcard.classList.toggle("flipped");
    flipped = !flipped;
};

/* NAVIGATION */
nextBtn.onclick = () => {
    if (index < cards.length - 1) { index++; show(); }
    else alert("Study Completed 🎉");
};
prevBtn.onclick = () => {
    if (index > 0) { index--; show(); }
};

/* LIKE */
likeBtn.onclick = () => {
    likeBtn.classList.toggle("liked");
    likeBtn.style.color = likeBtn.classList.contains("liked") ? "red" : "black";
};

/* COMMENTS */
postComment.onclick = () => {
    if (commentInput.value.trim()) {
        const div = document.createElement("div");
        div.className = "comment";
        div.innerText = commentInput.value;
        commentList.prepend(div);
        commentInput.value = "";
    }
};

/* EMOJI PICKER */
emojiBtn.onclick = () => {
    emojiPicker.style.display =
        emojiPicker.style.display === "block" ? "none" : "block";
};
emojiPicker.onclick = (e) => {
    commentInput.value += e.target.innerText;
};