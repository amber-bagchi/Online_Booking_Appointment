const form = document.getElementById("loginForm");
const API = "http://localhost:3000/api/users/login";

/* ===== PASSWORD TOGGLE ===== */
function togglePassword() {
  const pass = document.getElementById("password");
  pass.type = pass.type === "password" ? "text" : "password";
}

/* ===== FORM SUBMIT ===== */
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  const emailError = document.getElementById("emailError");
  const passError = document.getElementById("passError");

  let valid = true;

  if (!email.includes("@")) {
    emailError.style.display = "block";
    valid = false;
  } else emailError.style.display = "none";

  if (!password) {
    passError.style.display = "block";
    valid = false;
  } else passError.style.display = "none";

  if (!valid) return;

  try {
    const res = await axios.post(API, { email, password });

    /* ✅ STORE TOKEN */
    const token = res.data.token;

    if (!token) {
      showToast("Token not received ❌", "#ff4d4d");
      return;
    }

    localStorage.setItem("token", token);
    localStorage.setItem("userEmail", res.data.user.email);

    showToast("Login successful 🎉 Redirecting...", "#4CAF50");

    setTimeout(() => {
      window.location.href = "../dashboard/dashboard.html";
    }, 1200);

  } catch (err) {
    showToast(err.response?.data?.message || "Login failed ❌", "#ff4d4d");
  }
});

/* ===== TOAST ===== */
function showToast(message, color) {
  let toast = document.getElementById("toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.style.background = color;
  toast.style.display = "block";

  setTimeout(() => {
    toast.style.display = "none";
  }, 1500);
}
