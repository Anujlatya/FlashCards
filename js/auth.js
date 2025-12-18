import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js"

/* ================= FIREBASE ================= */
const firebaseConfig = {
  apiKey: "AIzaSyDwkY2zzFireAk-ZAB2x3_zswDJOSYEbBk",
  authDomain: "fir-5f6f0.firebaseapp.com",
  projectId: "fir-5f6f0",
  storageBucket: "fir-5f6f0.firebasestorage.app",
  messagingSenderId: "23744929552",
  appId: "1:23744929552:web:1a22ebf209d10b4c384f95"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

/* ================= UI HELPERS ================= */
const overlay = document.getElementById("overlay");
const popup = document.getElementById("popup");
const popupContent = document.getElementById("popupContent");
const loader = document.getElementById("loader");
const msgPopup = document.getElementById("msg-popup");

window.loadComponent = async (name) => {
  overlay.style.display = "block";
  popup.style.display = "block";
  loader.classList.remove("hidden");
  popupContent.innerHTML = "";

  const res = await fetch(`/components/${name}.html`);
  popupContent.innerHTML = await res.text();

  loader.classList.add("hidden");
  bindAuthForms(); // 🔥 MOST IMPORTANT
};

window.closePopup = () => {
  overlay.style.display = "none";
  popup.style.display = "none";
  popupContent.innerHTML = "";
};

function showFormMessage(el, text, type) {
  el.innerText = text;
  el.className = `form-message ${type}`;
  el.style.display = "block";
}

function toggleLoading(btn, state) {
  btn.querySelector(".btn-text").classList.toggle("hidden", state);
  btn.querySelector(".spinner").classList.toggle("hidden", !state);
  btn.disabled = state;
}

function bindAuthForms() {

  /* SIGNUP */
  const signupForm = document.getElementById("signup-form");
  if (signupForm) {
    const msg = document.getElementById("signup-msg");
    const btn = signupForm.querySelector("button");

    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      toggleLoading(btn, true);
      msg.style.display = "none";

      try {
        await createUserWithEmailAndPassword(
          auth,
          signupForm["signup-email"].value,
          signupForm["signup-password"].value
        );
        showFormMessage(msg, "Account created successfully ✅", "success");
        signupForm.reset();
      } catch (err) {
        showFormMessage(msg, err.message, "error");
      } finally {
        toggleLoading(btn, false);
      }
    });
  }

  /* SIGNIN */
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    const msg = document.getElementById("signin-msg");
    const btn = loginForm.querySelector("button");

    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      toggleLoading(btn, true);
      msg.style.display = "none";

      try {
        await signInWithEmailAndPassword(
          auth,
          loginForm["login-email"].value,
          loginForm["login-password"].value
        );
        showFormMessage(msg, "Login successful 🎉", "success");
        loginForm.reset();
      } catch (err) {
        showFormMessage(msg, err.message, "error");
      } finally {
        toggleLoading(btn, false);
      }
    });
  }
}
