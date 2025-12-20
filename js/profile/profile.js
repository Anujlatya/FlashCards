import { onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

import { auth } from "../firebase/firebaseConfig.js";
import { updateUserDoc } from "../auth/userService.js";
import {
  updateProfile
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { requireAuth } from "../auth/authMiddleware.js";

requireAuth(["user"]);

const form = document.getElementById("profile-form");
const nameInput = document.getElementById("profileName");
const photoInput = document.getElementById("profilePhoto");

/* ✅ WAIT FOR AUTH STATE */
onAuthStateChanged(auth, (user) => {
  if (!user) return;

  // 🔥 PREFILL DATA (NOW IT WORKS)
  nameInput.value = user.displayName || "";
  photoInput.value = user.photoURL || "";
});

/* UPDATE PROFILE */
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    const user = auth.currentUser;
    if (!user) return;

    // 🔹 Update Firebase Auth
    await updateProfile(user, {
      displayName: nameInput.value,
      photoURL: photoInput.value
    });

    // 🔹 Update Firestore
    await updateUserDoc(user.uid, {
      name: nameInput.value,
      photoURL: photoInput.value
    });

    alert("Profile updated successfully ✅");
    window.location.href = "/pages/user/userDashboard.html";
  } catch (err) {
    alert(err.message);
  }
});
