import { onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

import { auth } from "../firebase/firebaseConfig.js";
import { getUserDoc } from "../auth/userService.js";
import { logoutUser } from "../auth/authService.js";
import { requireAuth } from "../auth/authMiddleware.js";

requireAuth(["user"]);

export async function loadUserNavbar() {
  const navbarContainer = document.getElementById("navbar-container");

  if (!navbarContainer) return;

  const res = await fetch("/components/userNavbar.html");
  navbarContainer.innerHTML = await res.text();

  const userNameEl = document.getElementById("userName");
  const logoutBtn = document.getElementById("logoutBtn");

  onAuthStateChanged(auth, async (user) => {
    if (!user) return;

    const userDoc = await getUserDoc(user.uid);
    const name =
      userDoc?.name ||
      user.displayName ||
      user.email.split("@")[0];

    userNameEl.textContent = `Hi, ${name}`;
  });

  logoutBtn.onclick = async () => {
    await logoutUser();
    window.location.href = "/pages/index.html";
  };
}
