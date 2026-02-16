/* ================= CONFIG ================= */
const API = "http://localhost:3000/api/expenses";
const token = localStorage.getItem("token");

/* ================= AUTH CHECK ================= */
if (!token) {
  window.location.href = "../login-page/login.html";
}

/* ================= AXIOS ================= */
const api = axios.create({
  baseURL: API,
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});

/* ================= DOM ================= */
const form = document.getElementById("expenseForm");
const list = document.getElementById("expenseList");
const leaderboardBody = document.getElementById("leaderboardBody");

const transactionsSection = document.getElementById("transactionsSection");
const leaderboardSection = document.getElementById("leaderboardSection");

const txnBtn = document.getElementById("txnBtn");
const lbBtn = document.getElementById("lbBtn");

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
          <small>📅 ${formatDate(exp.date)} • ${exp.category} • ${exp.payment}</small>
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
    amount: amount.value,
    description: description.value,
    date: date.value,
    category: category.value,
    currency: currency.value,
    payment: payment.value,
  };

  try {
    await api.post("/addExpense", expense);

    form.reset();
    loadExpenses();

  } catch (err) {
    handleAuthError(err);
  }
});

/* ================= DELETE ================= */
async function deleteExpense(id) {
  try {
    await api.delete(`/deleteExpense/${id}`);
    loadExpenses();
  } catch (err) {
    handleAuthError(err);
  }
}

/* ================= LEADERBOARD ================= */
async function loadLeaderboard() {
  try {
    const res = await api.get("/leaderboard");

    leaderboardBody.innerHTML = "";

    res.data.forEach((u, i) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${i + 1}</td>
        <td>${u.name}</td>
        <td>₹ ${u.total_cost}</td>
      `;

      leaderboardBody.appendChild(row);
    });

  } catch (err) {
    handleAuthError(err);
  }
}

/* ================= NAVIGATION ================= */
function showTransactions() {
  transactionsSection.style.display = "block";
  leaderboardSection.style.display = "none";

  txnBtn.classList.add("active");
  lbBtn.classList.remove("active");
}

function showLeaderboard() {
  transactionsSection.style.display = "none";
  leaderboardSection.style.display = "block";

  lbBtn.classList.add("active");
  txnBtn.classList.remove("active");

  loadLeaderboard();
}

/* ================= UTIL ================= */
function logout() {
  localStorage.clear();
  window.location.href = "../login-page/login.html";
}

function formatDate(d) {
  return new Date(d).toLocaleDateString("en-IN");
}

/* ================= AUTH ERROR ================= */
function handleAuthError(err) {
  if (err.response?.status === 401) {
    localStorage.clear();
    window.location.href = "../login-page/login.html";
  }
}

/* ================= INIT ================= */
loadExpenses();
