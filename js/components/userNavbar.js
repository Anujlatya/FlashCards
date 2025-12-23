
import { onAuthStateChanged } from
"https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

import { auth } from "../firebase/firebaseConfig.js";
import { logoutUser } from "../auth/authService.js";
import { requireAuth } from "../auth/authMiddleware.js";
requireAuth(["user"]);

export async function loadUserNavbar() {
  const container = document.getElementById("navbar-container");
  if (!container) return;

  const res = await fetch("/components/userNavbar.html");
  container.innerHTML = await res.text();

  const menuBtn = document.getElementById("userMenuBtn");
  const menu = document.getElementById("userMenu");
  const initials = document.getElementById("userInitials");
  const logoutBtn = document.getElementById("logoutBtn");

  menuBtn.onclick = () => menu.classList.toggle("hidden");

  onAuthStateChanged(auth, (user) => {
    if (!user) return;
    initials.textContent =
      user.displayName?.[0]?.toUpperCase() ||
      user.email[0].toUpperCase();
  });

  logoutBtn.onclick = async () => {
    await logoutUser();
    window.location.href = "/pages/index.html";
  };
}
