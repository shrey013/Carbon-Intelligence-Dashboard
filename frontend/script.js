// ========== SIMPLE DATA MODEL ==========
const SECTORS = [
  { name: "Energy", value: 36, color: "#22c55e" },
  { name: "Transport", value: 8, color: "#38bdf8" },
  { name: "Industry & Manufacturing", value: 9, color: "#a855f7" },
  { name: "Buildings", value: 3.5, color: "#f97316" },
  { name: "Agriculture & Land Use", value: 7, color: "#22c55e88" }
];

// backend base URL
// const API_BASE_URL = "http://localhost:5000";
const API_BASE_URL = "https://93151c73-f058-424f-8c2d-b492b9ec1037.e1-us-east-azure.choreoapps.dev";


// Demo climate headlines (static but animated like live)
const NEWS_HEADLINES = [
  {
    source: "UNFCCC",
    title: "Global climate pact pushes deeper emissions cuts before 2030."
  },
  {
    source: "IEA",
    title: "Renewables meet record share of global electricity demand."
  },
  {
    source: "IPCC",
    title: "New report highlights shrinking carbon budget for 1.5°C target."
  },
  {
    source: "CDP",
    title: "Companies with net-zero plans see stronger investor confidence."
  },
  {
    source: "UNEP",
    title: "Cities accelerate EV adoption and low-carbon transport networks."
  }
];

// Simulated green-market stocks (clean energy, EV, renewables)
const STOCKS = [
  { symbol: "TSLA", label: "Tesla · EVs", price: 204.3, change: 1.24 },
  { symbol: "FSLR", label: "First Solar · PV", price: 168.9, change: -0.65 },
  { symbol: "ADANIGREEN", label: "Adani Green · RE", price: 1198.4, change: 2.18 },
  { symbol: "SUZLON", label: "Suzlon · Wind", price: 48.7, change: 0.92 },
  { symbol: "RENEW", label: "ReNew · Clean Power", price: 10.8, change: -0.31 }
];

// ========== MAIN INIT ==========
window.addEventListener("load", () => {
  // small delay so loading effect looks smooth
  setTimeout(() => {
    const loading = document.getElementById("loading");
    if (loading) loading.style.display = "none";
  }, 800);

  initMetrics();
  initChart();
  initCalculator();
  initChat();
  initIndustriesGrid();
  initNewsTicker();
  initMarketTicker();
});

// ========== METRICS ==========
let globalEmissionEstimate = SECTORS.reduce((sum, s) => sum + s.value, 0);

function initMetrics() {
  const globalEl = document.getElementById("global-emissions");
  const tempEl = document.getElementById("temperature");
  const trendEl = document.getElementById("global-emissions-trend");

  if (globalEl) {
    globalEl.textContent = `${globalEmissionEstimate.toFixed(1)} Gt CO₂`;
  }
  if (tempEl) {
    tempEl.textContent = "+1.1 °C";
  }
  if (trendEl) {
    trendEl.textContent =
      "Approximate global total based on sector model (simulated).";
  }

  // small live wiggle to feel dynamic
  setInterval(() => {
    const change = (Math.random() - 0.5) * 0.4;
    globalEmissionEstimate = Math.max(
      55,
      Math.min(70, globalEmissionEstimate + change)
    );
    if (globalEl) {
      globalEl.textContent = `${globalEmissionEstimate.toFixed(1)} Gt CO₂`;
    }
  }, 15000);
}

// ========== CHART (Chart.js) ==========
let emissionChart;

function initChart() {
  const ctx = document.getElementById("emissionChart");
  if (!ctx || typeof Chart === "undefined") return;

  emissionChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: SECTORS.map((s) => s.name),
      datasets: [
        {
          label: "Estimated annual CO₂ (Gt)",
          data: SECTORS.map((s) => s.value),
          backgroundColor: SECTORS.map((s) => s.color),
          borderColor: "#f9fafb",
          borderWidth: 1,
          borderRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: "#e5e7eb",
            font: { size: 11 }
          }
        },
        tooltip: {
          backgroundColor: "#020617",
          borderColor: "#22c55e",
          borderWidth: 1,
          bodyColor: "#e5e7eb",
          titleColor: "#bbf7d0",
          callbacks: {
            label: (ctx) =>
              `${ctx.label}: ${Number(ctx.raw).toFixed(2)} Gt CO₂ (rough estimate)`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: "#9ca3af",
            callback: (v) => v + " Gt"
          },
          grid: { color: "rgba(55,65,81,0.4)" }
        },
        x: {
          ticks: { color: "#9ca3af" },
          grid: { display: false }
        }
      }
    }
  });

  // mode buttons
  document.querySelectorAll(".chart-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".chart-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const mode = btn.dataset.mode;
      updateChartMode(mode);
    });
  });

  const resetBtn = document.getElementById("refresh-chart");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      updateChartMode("annual");
      document
        .querySelectorAll(".chart-btn")
        .forEach((b) => b.classList.remove("active"));
      const annualBtn = document.querySelector('[data-mode="annual"]');
      if (annualBtn) annualBtn.classList.add("active");
    });
  }
}

function updateChartMode(mode = "annual") {
  if (!emissionChart) return;
  if (mode === "monthly") {
    emissionChart.data.datasets[0].label = "Approx monthly CO₂ (Gt)";
    emissionChart.data.datasets[0].data = SECTORS.map(
      (s) => s.value / 12 + Math.random() * 0.1
    );
  } else {
    emissionChart.data.datasets[0].label = "Estimated annual CO₂ (Gt)";
    emissionChart.data.datasets[0].data = SECTORS.map((s) => s.value);
  }
  emissionChart.update();
}

// ========== SIMPLE EMISSION CALCULATOR (talks to backend) ==========
function initCalculator() {
  const btn = document.getElementById("calc-btn");
  if (!btn) return;

  btn.addEventListener("click", async () => {
    const elec = parseFloat(
      document.getElementById("input-electricity")?.value || "0"
    );
    const fuel = parseFloat(
      document.getElementById("input-fuel")?.value || "0"
    );
    const travel = parseFloat(
      document.getElementById("input-travel")?.value || "0"
    );

    const resultEl = document.getElementById("calc-result");
    if (!resultEl) return;

    if (elec <= 0 && fuel <= 0 && travel <= 0) {
      resultEl.textContent =
        "Please enter some positive numbers first, then I will estimate your footprint.";
      return;
    }

    resultEl.textContent = "Calculating using backend API…";

    try {
      const resp = await fetch(`${API_BASE_URL}/api/calc`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ electricity: elec, fuel, travel })
      });

      if (!resp.ok) {
        throw new Error("Backend error " + resp.status);
      }

      const data = await resp.json();
      const monthlyKg = parseFloat(data.totalEmission); // monthly kg CO2 from backend
      const yearlyKg = monthlyKg * 12;
      const yearlyTonnes = yearlyKg / 1000;

      resultEl.innerHTML = `
        Estimated monthly footprint: <strong>${monthlyKg.toFixed(
          1
        )} kg CO₂</strong><br/>
        Estimated yearly footprint: <strong>${yearlyTonnes.toFixed(
          2
        )} tonnes CO₂</strong><br/>
        <span style="color:#9ca3af;font-size:0.8rem;">
          Calculated via backend API. This is a rough approximation for awareness, not a certified inventory.
        </span>
      `;
    } catch (err) {
      console.error("Calc API error:", err);

      // fallback to local calculation if backend fails
      const EF_ELEC = 0.82; // per kWh
      const EF_FUEL = 2.31; // per litre of petrol
      const EF_TRAVEL = 0.121; // per km

      const monthlyKg =
        elec * EF_ELEC + fuel * EF_FUEL + travel * EF_TRAVEL;
      const yearlyKg = monthlyKg * 12;
      const yearlyTonnes = yearlyKg / 1000;

      resultEl.innerHTML = `
        Backend not reachable, used local factors instead.<br/>
        Monthly footprint: <strong>${monthlyKg.toFixed(
          1
        )} kg CO₂</strong><br/>
        Yearly footprint: <strong>${yearlyTonnes.toFixed(2)} tonnes CO₂</strong>
      `;
    }
  });
}

// ========== CHAT / AI ASSISTANT ==========
function initChat() {
  const input = document.getElementById("userInput");
  const sendBtn = document.getElementById("sendBtn");

  if (!input || !sendBtn) return;

  // enter key send
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  });

  sendBtn.addEventListener("click", () => {
    handleSend();
  });

  // quick buttons
  document.querySelectorAll(".quick-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const text = btn.textContent.replace(/\s+/g, " ").trim();
      if (text) {
        input.value = text;
        handleSend();
      }
    });
  });
}

function handleSend() {
  const input = document.getElementById("userInput");
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, "user");
  input.value = "";
  sendToBackend(text);
}

function addMessage(text, sender) {
  const container = document.getElementById("chatMessages");
  if (!container) return;

  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${sender}`;

  const avatar = document.createElement("div");
  avatar.className = "message-avatar";
  avatar.innerHTML =
    sender === "ai"
      ? '<i class="fas fa-brain"></i>'
      : '<i class="fas fa-user"></i>';

  const content = document.createElement("div");
  content.className = "message-content";
  const prefix =
    sender === "ai" ? "<strong>Carbon AI:</strong> " : "<strong>You:</strong> ";
  content.innerHTML = prefix + escapeHtml(text);

  messageDiv.appendChild(avatar);
  messageDiv.appendChild(content);
  container.appendChild(messageDiv);
  container.scrollTop = container.scrollHeight;
}

function addTyping() {
  const container = document.getElementById("chatMessages");
  if (!container) return;
  removeTyping();
  const div = document.createElement("div");
  div.className = "message ai";
  div.id = "typing-indicator";
  div.innerHTML = `
    <div class="message-avatar"><i class="fas fa-brain"></i></div>
    <div class="message-content"><strong>Carbon AI:</strong> <em>Thinking...</em></div>
  `;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function removeTyping() {
  const existing = document.getElementById("typing-indicator");
  if (existing) existing.remove();
}

async function sendToBackend(userMessage) {
  addTyping();
  try {
    const resp = await fetch(`${API_BASE_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: userMessage,
        context: {
          source: "stride-labs-dashboard",
          sectors: SECTORS
        }
      })
    });

    removeTyping();

    if (!resp.ok) {
      addMessage(
        "I could not reach the backend (status " +
          resp.status +
          "). Please make sure the Node server is running on port 5000.",
        "ai"
      );
      return;
    }

    const data = await resp.json();
    const reply = data.reply || data.message || JSON.stringify(data);
    addMessage(reply, "ai");
  } catch (err) {
    console.error(err);
    removeTyping();
    addMessage(
      "I’m not able to talk to the backend right now. Please check if `npm start` is running in the backend folder and API_BASE_URL is correct.",
      "ai"
    );
  }
}

// small helper to avoid HTML injection issues
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// ========== INDUSTRIES GRID ==========
function initIndustriesGrid() {
  const grid = document.getElementById("industriesGrid");
  if (!grid) return;

  grid.innerHTML = "";
  SECTORS.forEach((sector) => {
    const card = document.createElement("div");
    card.className = "industry-card";

    const header = document.createElement("div");
    header.className = "industry-header";

    const name = document.createElement("div");
    name.className = "industry-name";
    name.textContent = sector.name;

    const value = document.createElement("div");
    value.className = "industry-value";
    value.textContent = sector.value.toFixed(1) + " Gt";

    header.appendChild(name);
    header.appendChild(value);

    const trend = document.createElement("p");
    trend.className = "industry-trend";
    trend.textContent =
      sector.name === "Energy"
        ? "High baseline – priority for deep decarbonisation."
        : sector.name === "Transport"
        ? "Accelerate EVs, public transit and fuel efficiency."
        : sector.name === "Buildings"
        ? "Improve insulation and electrify heating/cooling."
        : sector.name.startsWith("Agriculture")
        ? "Focus on soil health, diets and methane reductions."
        : "Process optimisation and clean heat are key levers.";

    card.appendChild(header);
    card.appendChild(trend);

    // When you click a card, highlight that sector in the chart
    card.addEventListener("click", () => {
      highlightSectorInChart(sector.name);
    });

    grid.appendChild(card);
  });
}

function highlightSectorInChart(sectorName) {
  if (!emissionChart) return;
  const idx = emissionChart.data.labels.indexOf(sectorName);
  if (idx === -1) return;

  // briefly "bounce" the selected bar by tweaking value
  const original = SECTORS[idx].value;
  emissionChart.data.datasets[0].data[idx] = original * 1.1;
  emissionChart.update();

  setTimeout(() => {
    emissionChart.data.datasets[0].data[idx] = original;
    emissionChart.update();
  }, 600);
}

// ========== CLIMATE NEWS TICKER ==========
function initNewsTicker() {
  const ticker = document.getElementById("newsTicker");
  if (!ticker) return;

  // We duplicate the headlines so the marquee feels continuous
  function buildItems() {
    ticker.innerHTML = "";
    const all = [...NEWS_HEADLINES, ...NEWS_HEADLINES];
    all.forEach((h) => {
      const item = document.createElement("div");
      item.className = "news-item";
      item.innerHTML = `
        <span class="news-source">${escapeHtml(h.source)}</span>
        <span class="news-title">${escapeHtml(h.title)}</span>
      `;
      ticker.appendChild(item);
    });
  }

  buildItems();
}

// ========== GREEN MARKET INDEX (STOCK TICKER) ==========
let stockState = STOCKS.map((s) => ({ ...s }));

function initMarketTicker() {
  const container = document.getElementById("marketTicker");
  if (!container) return;

  function render() {
    container.innerHTML = "";
    stockState.forEach((s) => {
      const chip = document.createElement("div");
      chip.className = "stock-chip";

      const symbol = document.createElement("span");
      symbol.className = "stock-symbol";
      symbol.textContent = s.symbol;

      const price = document.createElement("span");
      price.className = "stock-price";
      price.textContent = s.price.toFixed(2);

      const change = document.createElement("span");
      change.className =
        "stock-change " + (s.change >= 0 ? "positive" : "negative");
      const icon =
        s.change >= 0
          ? '<i class="fas fa-arrow-up"></i>'
          : '<i class="fas fa-arrow-down"></i>';
      change.innerHTML = `${icon}${Math.abs(s.change).toFixed(2)}%`;

      const label = document.createElement("span");
      label.className = "stock-label";
      label.textContent = s.label;

      chip.appendChild(symbol);
      chip.appendChild(price);
      chip.appendChild(change);
      chip.appendChild(label);

      container.appendChild(chip);
    });
  }

  function randomUpdate() {
    stockState = stockState.map((s) => {
      // small random move
      const baseVol = Math.max(0.1, Math.abs(s.change) * 0.3 + 0.15);
      const delta = (Math.random() - 0.5) * baseVol;
      const newChange = s.change + delta;
      const newPrice = Math.max(1, s.price * (1 + newChange / 1000));
      return { ...s, change: newChange, price: newPrice };
    });
    render();
  }

  render();
  setInterval(randomUpdate, 4000);
}
