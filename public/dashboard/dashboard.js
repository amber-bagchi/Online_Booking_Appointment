/* ================= CONFIG ================= */
const API = "http://localhost:3000/api/expenses";


const form = document.getElementById("expenseForm");
const list = document.getElementById("expenseList");


const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "../login-page/login.html";
}


const api = axios.create({
  baseURL: API,
  headers: {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  },
});


async function loadExpenses() {
  try {
    const res = await api.get("/");
    const data = res.data;

    list.innerHTML = "";

    data.forEach((exp) => {
      const li = document.createElement("li");

      li.innerHTML = `
        <span>
          ${exp.amount} ${exp.currency} - ${exp.description}
          <br/>
          <small>${exp.category} • ${exp.payment}</small>
        </span>
        <button class="delete-btn" onclick="deleteExpense(${exp.id})">X</button>
      `;

      list.appendChild(li);
    });
  } catch (err) {
    showToast("Failed to load expenses ❌", "#ff4d4d");
  }
}


form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const expense = {
    amount: document.getElementById("amount").value,
    description: document.getElementById("description").value,
    category: document.getElementById("category").value,
    currency: document.getElementById("currency").value,
    payment: document.getElementById("payment").value,
  };

  try {
    await api.post("/", expense);

    showToast("Expense added ✅", "#4CAF50");

    form.reset();
    loadExpenses();
  } catch (err) {
    showToast("Failed to add expense ❌", "#ff4d4d");
  }
});


async function deleteExpense(id) {
  try {
    await api.delete(`/${id}`);
    showToast("Expense deleted 🗑️", "#ff4d4d");
    loadExpenses();
  } catch (err) {
    showToast("Delete failed ❌", "#ff4d4d");
  }
}


function logout() {
  localStorage.removeItem("token");
  window.location.href = "../login-page/login.html";
}


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


loadExpenses();
