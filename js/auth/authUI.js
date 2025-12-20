import { signupUser, signinUser } from "./authService.js";

export function bindAuthForms() {
  /* SIGNUP */
  const signupForm = document.getElementById("signup-form");
  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      try {
        await signupUser(
          signupForm["signup-email"].value,
          signupForm["signup-password"].value
        );
        window.location.href = "/pages/user/userDashboard.html";
      } catch (err) {
        alert(err.message);
      }
    });
  }

  /* LOGIN */
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      try {
        await signinUser(
          loginForm["login-email"].value,
          loginForm["login-password"].value
        );
        window.location.href = "/pages/user/userDashboard.html";
      } catch (err) {
        alert(err.message);
      }
    });
  }
}
