import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import { db } from "../firebase/firebaseConfig.js";

export const createUserDoc = async (user) => {
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    email: user.email,
    name: "",
    photoURL: "",
    role: "user",
    isProfileComplete: true,
    createdAt: serverTimestamp()
  });
};

export const getUserDoc = async (uid) => {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
};

export const updateUserDoc = async (uid, data) => {
  await updateDoc(doc(db, "users", uid), data);
};

