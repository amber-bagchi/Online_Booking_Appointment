const form = document.getElementById("loginForm");
const API = "http://localhost:3000/api/login";

// Toggle password
function togglePassword() {
  const pass = document.getElementById("password");
  pass.type = pass.type === "password" ? "text" : "password";
}

// Submit login
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
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      showToast(data.message || "Login failed ❌", "#ff4d4d");
      return;
    }

    showToast("Login successful 🎉", "#4CAF50");

    
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 1500);
  } catch (err) {
    showToast("Server not reachable 🚨", "#ff4d4d");
  }
});

// Toast
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
  toast.style.opacity = "1";

  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => (toast.style.display = "none"), 300);
  }, 2500);
}
