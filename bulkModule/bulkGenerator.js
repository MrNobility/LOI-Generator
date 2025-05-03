window.BulkLOI = window.BulkLOI || {};
var BulkLOI = window.BulkLOI;

BulkLOI.bulkGenerateLOIs = async function (deals, globalToneStyle) {
  const outputContainer = document.getElementById("bulk-loi-output");
  outputContainer.innerHTML = "Loading...";

  const toneTemplates = await preloadTones();
  outputContainer.innerHTML = "";

  for (let index = 0; index < deals.length; index++) {
    const deal = deals[index];
    const toneStyle = deal.toneStyle || globalToneStyle;
    const normalizedTone = normalizeTone(toneStyle);

    const sellerFinanceLOI = generateLOI(deal, "sellerFinance", normalizedTone, toneTemplates);

    let cashDeal = { ...deal };
    const listed = parseFloat(cashDeal["Listed Price"]);
    if (!isNaN(listed)) {
      cashDeal["Purchase Price"] = (listed * 0.68).toFixed(2);
    }

    const cashLOI = generateLOI(cashDeal, "cash", "professional", toneTemplates);

    const container = document.createElement("div");
    container.className = "deal-loi-container border rounded-lg mb-4 shadow";

    const fullAddress = deal["Full Address"] || `Deal #${index + 1}`;
    const header = document.createElement("button");
    header.className = "deal-header w-full text-left font-semibold text-lg p-3 bg-gray-100 hover:bg-gray-200";
    header.innerHTML = `${fullAddress} <span class='toggle-icon'>▼</span>`;

    const content = document.createElement("div");
    content.className = "deal-content p-4 hidden transition-all";

    header.addEventListener("click", () => {
      content.classList.toggle("hidden");
      const icon = header.querySelector(".toggle-icon");
      icon.textContent = content.classList.contains("hidden") ? "▼" : "▲";
    });

    content.appendChild(createOfferBlock("Seller Finance LOI", sellerFinanceLOI));
    content.appendChild(createOfferBlock("Cash Offer LOI", cashLOI));

    container.appendChild(header);
    container.appendChild(content);
    outputContainer.appendChild(container);
  }
};

function generateLOI(deal, offerType, tone, toneTemplates) {
  const key = `${offerType}-${tone}`;
  const toneData = toneTemplates[key];

  if (!toneData || !Array.isArray(toneData.sections)) {
    return `<p style='color:red;'>Template not found: ${key}</p>`;
  }

  const formData = {
    agent: deal.agent || "",
    address: deal["Full Address"] || "",
    price: formatCurrency(deal["Purchase Price"]),
    down: formatCurrency(deal["Down Payment"]),
    monthly: formatCurrency(deal["Monthly Payment (PITI)"]),
    rate: deal["Interest Rate"] ? parseFloat(deal["Interest Rate"]).toFixed(2) + "%" : "",
    balloon: deal["Balloon Term"] ? deal["Balloon Term"] + " years" : "",
    amort: deal["Amortization"] ? deal["Amortization"] + " years" : "",
    insurance: formatCurrency(deal["Monthly Insurance"]),
    taxes: formatCurrency(deal["Monthly Taxes"]),
    closeEscrow: deal["Close of Escrow"] || "",
    emd: formatCurrency(deal["EMD"]),
    yourName: deal.yourName || "Dalton Eddleman",
    yourPhone: deal.yourPhone || "512-265-5448",
    yourEmail: deal.yourEmail || "Mr.Nobility@nobility.network"
  };

  const filledSections = toneData.sections.map(section =>
    section.replace(/{{(\w+?)}}/g, (_, key) => formData[key] || "")
  ).join("<br><br>");

  const subject = toneData.subject.replace(/{{(\w+?)}}/g, (_, key) => formData[key] || "");

  return `<strong>Subject:</strong> ${subject}<br><br>${filledSections}`;
}

function createOfferBlock(title, htmlContent) {
  const block = document.createElement("div");
  block.className = "mb-6 p-4 border-l-4 rounded bg-gray-50";

  const heading = document.createElement("h3");
  heading.className = "font-bold mb-2";
  heading.textContent = title;

  const content = document.createElement("div");
  content.className = "loi-content mb-2 text-sm";
  content.innerHTML = htmlContent;

  const copyBtn = document.createElement("button");
  copyBtn.className = "px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600";
  copyBtn.textContent = "Copy to Clipboard";
  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(content.innerText).then(() => {
      copyBtn.textContent = "Copied!";
      setTimeout(() => (copyBtn.textContent = "Copy to Clipboard"), 1500);
    });
  });

  block.appendChild(heading);
  block.appendChild(content);
  block.appendChild(copyBtn);
  return block;
}

function formatCurrency(value) {
  const num = parseFloat(value);
  if (isNaN(num)) return "";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(num);
}

function normalizeTone(input) {
  const map = {
    "Seller Finance Acquisitions": "professional",
    "Market Reality": "marketReality",
    "Professional": "professional",
    "professional": "professional",
    "marketReality": "marketReality",
    "": "professional",
    null: "professional",
    undefined: "professional"
  };
  return map[input] || "professional";
}

async function preloadTones() {
  const toneFiles = [
    { offerType: "sellerFinance", tone: "marketReality" },
    { offerType: "sellerFinance", tone: "professional" },
    { offerType: "cash", tone: "professional" }
  ];
  const tones = {};
  for (const { offerType, tone } of toneFiles) {
    const key = `${offerType}-${tone}`;
    try {
      const res = await fetch(`tones/${key}.json`);
      tones[key] = await res.json();
    } catch {
      console.warn(`Missing tone file: ${key}`);
    }
  }
  return tones;
}

