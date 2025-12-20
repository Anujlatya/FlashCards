import { giveAccess } from "./auth/authMiddleware.js";
import { bindAuthForms } from "./auth/authUI.js";
giveAccess(["user"]);

const overlay = document.getElementById("overlay");
const popup = document.getElementById("popup");
const popupContent = document.getElementById("popupContent");

window.loadComponent = async (name) => {
  overlay.style.display = "block";
  popup.style.display = "block";

  const res = await fetch(`/components/${name}.html`);
  popupContent.innerHTML = await res.text();

  bindAuthForms();
};

window.closePopup = () => {
  overlay.style.display = "none";
  popup.style.display = "none";
  popupContent.innerHTML = "";
};