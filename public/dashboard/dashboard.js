/* ================= CONFIG ================= */
const API = "http://localhost:3000/api/expenses";

const form = document.getElementById("expenseForm");
const list = document.getElementById("expenseList");

/* ================= AUTH CHECK ================= */
const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "../login-page/login.html";
}

/* ================= AXIOS INSTANCE ================= */
const api = axios.create({
  baseURL: API,
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});

/* ================= LOAD EXPENSES ================= */
async function loadExpenses() {
  try {
    const res = await api.get("/getExpense");

    list.innerHTML = "";

    res.data.forEach((exp) => {
      const li = document.createElement("li");

      li.innerHTML = `
        <span>
          <strong>${exp.amount} ${exp.currency}</strong> - ${exp.description}
          <br/>
          <small>
            📅 ${formatDate(exp.date)} • ${exp.category} • ${exp.payment}
          </small>
        </span>
        <button class="delete-btn" onclick="deleteExpense(${exp.id})">X</button>
      `;

      list.appendChild(li);
    });

  } catch (err) {
    handleAuthError(err);
  }
}

/* ================= ADD EXPENSE ================= */
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const expense = {
    amount: document.getElementById("amount").value,
    description: document.getElementById("description").value,
    date: document.getElementById("date").value,
    category: document.getElementById("category").value,
    currency: document.getElementById("currency").value,
    payment: document.getElementById("payment").value,
  };

  try {
    await api.post("/addExpense", expense);

    showToast("Expense added successfully ✅", "#4CAF50");

    form.reset();
    loadExpenses();

  } catch (err) {
    handleAuthError(err);
  }
});

/* ================= DELETE EXPENSE ================= */
async function deleteExpense(id) {
  try {
    await api.delete(`/deleteExpense/${id}`);

    showToast("Expense deleted 🗑️", "#ff4d4d");

    loadExpenses();

  } catch (err) {
    handleAuthError(err);
  }
}

/* ================= LOGOUT ================= */
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userEmail");

  window.location.href = "../login-page/login.html";
}

/* ================= FORMAT DATE ================= */
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN");
}

/* ================= HANDLE 401 ================= */
function handleAuthError(err) {
  if (err.response?.status === 401) {
    showToast("Session expired. Please login again 🔒", "#ff4d4d");

    localStorage.removeItem("token");

    setTimeout(() => {
      window.location.href = "../login-page/login.html";
    }, 1200);

    return;
  }

  showToast("Something went wrong ❌", "#ff4d4d");
}

/* ================= TOAST ================= */
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
    setTimeout(() => {
      toast.style.display = "none";
    }, 300);
  }, 1500);
}

/* ================= INIT ================= */
loadExpenses();
