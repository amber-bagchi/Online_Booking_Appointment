const form = document.getElementById("signupForm");
const API = "http://localhost:3000/api/signup";

// ---------------- PASSWORD TOGGLE ----------------
function togglePassword() {
  const pass = document.getElementById("password");
  pass.type = pass.type === "password" ? "text" : "password";
}

// ---------------- FORM SUBMIT ----------------
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Get values
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  // Error elements
  const nameError = document.getElementById("nameError");
  const emailError = document.getElementById("emailError");
  const passError = document.getElementById("passError");

  let valid = true;

  // ----------- VALIDATION -----------

  if (name.length < 2) {
    nameError.textContent = "Enter valid name";
    nameError.style.display = "block";
    valid = false;
  } else {
    nameError.style.display = "none";
  }

  if (!email.includes("@")) {
    emailError.textContent = "Enter valid email";
    emailError.style.display = "block";
    valid = false;
  } else {
    emailError.style.display = "none";
  }

  if (password.length < 6) {
    passError.textContent = "Min 6 characters";
    passError.style.display = "block";
    valid = false;
  } else {
    passError.style.display = "none";
  }

  if (!valid) return;

  // ----------- CALL BACKEND API -----------

  try {
    const res = await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    // ----------- EMAIL EXISTS ERROR (403) -----------

    if (res.status === 403) {
      emailError.textContent = "Email already exists ❌";
      emailError.style.display = "block";
      return;
    }

    // ----------- SUCCESS -----------

    if (res.status === 201 || res.ok) {
      showSuccessMessage("Signup successful 🎉");
      form.reset();
      clearErrors();
      setTimeout(() => {
        window.location.href = "/public/login-page/login.html";
      }, 1500);
      return;
    }

    // ----------- OTHER SERVER ERROR -----------

    showErrorMessage(data.message || "Something went wrong ❌");
  } catch (err) {
    showErrorMessage("Server not reachable 🚨");
  }
});

// ---------------- RESET HANDLER ----------------
form.addEventListener("reset", clearErrors);

// ---------------- CLEAR ERRORS ----------------
function clearErrors() {
  document.getElementById("nameError").style.display = "none";
  document.getElementById("emailError").style.display = "none";
  document.getElementById("passError").style.display = "none";
}

// ---------------- SUCCESS MESSAGE UI ----------------
function showSuccessMessage(msg) {
  showToast(msg, "#4CAF50");
}

// ---------------- ERROR MESSAGE UI ----------------
function showErrorMessage(msg) {
  showToast(msg, "#ff4d4d");
}

// ---------------- TOAST NOTIFICATION ----------------
function showToast(message, color) {
  let toast = document.getElementById("toast");

  // create toast if not exists
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
