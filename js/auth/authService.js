import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

import { auth } from "../firebase/firebaseConfig.js";
import { createUserDoc, getUserDoc, updateUserDoc } from "./userService.js";

/* SIGNUP */
export const signupUser = async (email, password) => {
  const res = await createUserWithEmailAndPassword(auth, email, password);
  console.log(res);

  await createUserDoc(res.user);

  const token = await res.user.getIdToken();
  localStorage.setItem("token", token);
  localStorage.setItem("role", "user");

  // 🔥 only redirect here
  window.location.href = "/pages/user/complete-profile.html";
};

/* LOGIN */
export const signinUser = async (email, password) => {
  const res = await signInWithEmailAndPassword(auth, email, password);

  const token = await res.user.getIdToken();
  localStorage.setItem("token", token);
  localStorage.setItem("role", "user");

  const userDoc = await getUserDoc(res.user.uid);

  if (!userDoc?.isProfileComplete) {
    window.location.href = "/pages/user/complete-profile.html";
  } else {
    window.location.href = "/pages/user/userDashboard.html";
  }
};

/* ✅ UPDATE PROFILE (AUTH + FIRESTORE) */
export const updateUserProfile = async (name, photoURL) => {
  if (!auth.currentUser) {
    throw new Error("User not authenticated");
  }

  // 🔹 Update Firebase Auth
  await updateProfile(auth.currentUser, {
    displayName: name,
    photoURL
  });

  // 🔹 Update Firestore
  await updateUserDoc(auth.currentUser.uid, {
    name,
    photoURL
  });
};

/* LOGOUT */
export const logoutUser = async () => {
  localStorage.clear();
  await signOut(auth);
};
