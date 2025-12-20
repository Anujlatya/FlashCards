import { auth } from "../firebase/firebaseConfig.js";
import { updateUserDoc } from "../auth/userService.js";
import {
  updateProfile
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

const form = document.getElementById("completeProfileForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  // const photoURL = document.getElementById("photoURL").value.trim();

  if (!name) {
    alert("Name is required");
    return;
  }

  try {
    await updateProfile(auth.currentUser, {
      displayName: name,
      // photoURL
    });

    await updateUserDoc(auth.currentUser.uid, { name, isProfileComplete: true });

    window.location.href = "/pages/user/userDashboard.html";
  } catch (err) {
    alert(err.message);
  }
});
