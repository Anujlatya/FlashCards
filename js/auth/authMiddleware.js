import { onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { auth } from "../firebase/firebaseConfig.js";
import { getUserDoc } from "./userService.js";

export function requireAuth(allowedRoles = []) {
  onAuthStateChanged(auth, async (user) => {

    if (!user) {
      window.location.href = "/pages/index.html";
      return;
    }

    const userDoc = await getUserDoc(user.uid);

    // Force profile completion
    // if (!userDoc?.isProfileComplete) {
    //   window.location.href = "/pages/user/complete-profile.html";
    //   return;
    // }

    const role = localStorage.getItem("role");

    if (allowedRoles.length && !allowedRoles.includes(role)) {
      window.location.href = "/pages/index.html";
    }
  });
}


export function giveAccess(allowedRoles = []) {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userDoc = await getUserDoc(user.uid);

      if (!userDoc?.isProfileComplete) {
        window.location.href = "/pages/user/complete-profile.html";
        return;
      }

      const role = localStorage.getItem("role");
      if (allowedRoles.length && allowedRoles.includes(role)) {
        window.location.href = "/pages/user/userDashboard.html";
      }
    }
  })
}