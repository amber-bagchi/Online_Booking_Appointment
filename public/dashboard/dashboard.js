/* CONFIG */
const API = "http://localhost:3000/api/expenses";
const token = localStorage.getItem("token");

if (!token) window.location.href = "../login-page/login.html";

/* AXIOS */
const api = axios.create({
  baseURL: API,
  headers: { Authorization: `Bearer ${token}` },
});

/* DOM */
const form = document.getElementById("expenseForm");
const list = document.getElementById("expenseList");
const leaderboardBody = document.getElementById("leaderboardBody");

const transactionsSection = document.getElementById("transactionsSection");
const leaderboardSection = document.getElementById("leaderboardSection");

const txnBtn = document.getElementById("txnBtn");
const lbBtn = document.getElementById("lbBtn");

const description = document.getElementById("description");
const category = document.getElementById("category");
const aiHint = document.getElementById("aiHint");
const aiLoader = document.getElementById("aiLoader");

const aiInsightSection = document.getElementById("aiInsightSection");
const aiBtn = document.getElementById("aiBtn");


/* LOAD EXPENSES */
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

/* ADD EXPENSE */
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
    aiHint.style.display = "none";
    loadExpenses();
  } catch (err) {
    handleAuthError(err);
  }
});

/* DELETE */
async function deleteExpense(id) {
  try {
    await api.delete(`/deleteExpense/${id}`);
    loadExpenses();
  } catch (err) {
    handleAuthError(err);
  }
}

/* LEADERBOARD */
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

/* NAVIGATION */
function showTransactions() {
  transactionsSection.style.display = "block";
  leaderboardSection.style.display = "none";
  aiInsightSection.style.display = "none";

  txnBtn.classList.add("active");
  lbBtn.classList.remove("active");
  aiBtn.classList.remove("active");
}


function showLeaderboard() {
  transactionsSection.style.display = "none";
  leaderboardSection.style.display = "block";
  aiInsightSection.style.display = "none";

  lbBtn.classList.add("active");
  txnBtn.classList.remove("active");
  aiBtn.classList.remove("active");

  loadLeaderboard();
}


/* AI CATEGORY DETECTION */
async function autoDetectCategory() {
  const desc = description.value.trim();
  if (!desc) return;

  try {
    aiLoader.style.display = "block";
    aiHint.style.display = "none";

    const res = await axios.post(
      "http://localhost:3000/api/ai/predict-category",
      { description: desc },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    category.value = res.data.category;
    aiHint.style.display = "inline";
  } catch (err) {
    console.error("AI prediction error", err);
  } finally {
    aiLoader.style.display = "none";
  }
}

async function loadAIInsight() {
  try {
    const res = await axios.get(
      "http://localhost:3000/api/insight/monthly-insight",
      { headers: { Authorization: `Bearer ${token}` } }
    );

    document.getElementById("aiInsightText").innerText = res.data.insight;

  } catch (err) {
    console.error("AI insight error", err);
    document.getElementById("aiInsightText").innerText =
      "Failed to load AI insight.";
  }
}

function showAIInsight() {
  transactionsSection.style.display = "none";
  leaderboardSection.style.display = "none";
  aiInsightSection.style.display = "block";

  txnBtn.classList.remove("active");
  lbBtn.classList.remove("active");
  aiBtn.classList.add("active");

  loadAIInsight();
}


/* Trigger AI on blur */
description.addEventListener("blur", autoDetectCategory);

/* Hide hint if user changes category manually */
category.addEventListener("change", () => {
  aiHint.style.display = "none";
});

/* UTIL */
function logout() {
  localStorage.clear();
  window.location.href = "../login-page/login.html";
}

function formatDate(d) {
  return new Date(d).toLocaleDateString("en-IN");
}

function handleAuthError(err) {
  if (err.response?.status === 401) logout();
}

function goToFinancialPage() {
  window.location.href = "../financial-insight/financial.html";
}



/* INIT */
loadExpenses();
