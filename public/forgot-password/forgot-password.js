const API_BASE = "http://localhost:3000/api/password";

const emailForm = document.getElementById("emailForm");
const resetForm = document.getElementById("resetForm");

/* ===== STEP 1: SEND OTP ===== */
emailForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();

  try {
    await axios.post(`${API_BASE}/forgot-password`, { email });

    showToast("OTP sent to your email 📩", "#4CAF50");

    emailForm.style.display = "none";
    resetForm.style.display = "block";

  } catch (err) {
    showToast(err.response?.data?.message || "Failed to send OTP ❌", "#ff4d4d");
  }
});

/* ===== STEP 2: RESET PASSWORD ===== */
resetForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const otp = document.getElementById("otp").value.trim();
  const newPassword = document.getElementById("newPassword").value.trim();

  try {
    await axios.post(`${API_BASE}/reset-password`, {
      email,
      otp,
      newPassword,
    });

    showToast("Password reset successful 🎉", "#4CAF50");

    setTimeout(() => {
      window.location.href = "../login-page/login.html";
    }, 1500);

  } catch (err) {
    showToast(err.response?.data?.message || "Reset failed ❌", "#ff4d4d");
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
  }, 2000);
}
