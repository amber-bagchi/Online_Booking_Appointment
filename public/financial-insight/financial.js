const API = "http://localhost:3000/api/expenses";
const token = localStorage.getItem("token");

let currentPage = 1;
const limit = 10;

const paginationDiv = document.createElement("div");
paginationDiv.className = "pagination";
document.body.appendChild(paginationDiv);


if (!token) window.location.href = "../login-page/login.html";

const api = axios.create({
  baseURL: API,
  headers: { Authorization: `Bearer ${token}` },
});

const reportList = document.getElementById("reportList");
const downloadBtn = document.getElementById("downloadBtn");

let allExpenses = [];

/* LOAD ALL EXPENSES */
async function loadExpenses() {
  try {
    const res = await api.get("/getExpense");
    allExpenses = res.data;
    renderReport("monthly"); // default
    checkPremium();
  } catch (err) {
    console.error(err);
  }
}

/* GROUPING LOGIC */
function groupExpenses(type) {
  const grouped = {};

  allExpenses.forEach((exp) => {
    const date = new Date(exp.date);
    let key;

    if (type === "daily") key = date.toLocaleDateString("en-IN");

    if (type === "weekly") {
      const first = new Date(date);
      first.setDate(date.getDate() - date.getDay());
      key = "Week of " + first.toLocaleDateString("en-IN");
    }

    if (type === "monthly") {
      key = date.toLocaleString("en-IN", { month: "long", year: "numeric" });
    }

    if (type === "yearly") key = date.getFullYear();

    grouped[key] = (grouped[key] || 0) + Number(exp.amount);
  });

  return grouped;
}

/* RENDER */
function renderReport(type) {
  const data = groupExpenses(type);
  reportList.innerHTML = "";

  Object.entries(data).forEach(([period, total]) => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${period}</span><span>₹ ${total.toFixed(2)}</span>`;
    reportList.appendChild(li);
  });
}

/* PREMIUM CHECK */
function checkPremium() {
  const isPremium = localStorage.getItem("isPremium") === "true";

  if (!isPremium) {
    downloadBtn.disabled = true;
    downloadBtn.innerText = "🔒 Premium Only";
    downloadBtn.style.opacity = "0.6";
    downloadBtn.style.cursor = "not-allowed";
  }
}

/* DOWNLOAD */
downloadBtn.addEventListener("click", () => {
  if (localStorage.getItem("isPremium") !== "true") return;

  let text = "Financial Report\n\n";

  document.querySelectorAll("#reportList li").forEach((li) => {
    text += li.innerText + "\n";
  });

  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "financial-report.txt";
  a.click();

  URL.revokeObjectURL(url);
});

/* BACK */
function goBack() {
  window.location.href = "../dashboard/dashboard.html";
}

async function loadPaginatedExpenses(page = 1) {
  try {
    const res = await axios.get(
      `http://localhost:3000/api/expenses/paginated?page=${page}&limit=${limit}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const data = res.data;

    currentPage = data.currentPage;

    renderExpenses(data.expenses);
    renderPagination(data.totalPages);
  } catch (err) {
    console.error("Pagination load error:", err);
  }
}

function renderExpenses(expenses) {
  reportList.innerHTML = "";

  if (expenses.length === 0) {
    reportList.innerHTML = "<li>No expenses found</li>";
    return;
  }

  expenses.forEach((exp) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${new Date(exp.date).toLocaleDateString("en-IN")} - ${exp.category}</span>
      <strong>₹ ${exp.amount}</strong>
    `;
    reportList.appendChild(li);
  });
}

function renderPagination(totalPages) {
  paginationDiv.innerHTML = "";

  /* Previous */
  const prev = document.createElement("button");
  prev.innerText = "⬅ Prev";
  prev.disabled = currentPage === 1;
  prev.onclick = () => loadPaginatedExpenses(currentPage - 1);
  paginationDiv.appendChild(prev);

  /* Page indicator */
  const info = document.createElement("span");
  info.innerText = ` Page ${currentPage} of ${totalPages} `;
  paginationDiv.appendChild(info);

  /* Next */
  const next = document.createElement("button");
  next.innerText = "Next ➡";
  next.disabled = currentPage === totalPages;
  next.onclick = () => loadPaginatedExpenses(currentPage + 1);
  paginationDiv.appendChild(next);

  /* Last page */
  const last = document.createElement("button");
  last.innerText = "Last ⏭";
  last.disabled = currentPage === totalPages;
  last.onclick = () => loadPaginatedExpenses(totalPages);
  paginationDiv.appendChild(last);
}


/* INIT */
loadExpenses();
loadPaginatedExpenses();
