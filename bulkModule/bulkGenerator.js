window.BulkLOI = window.BulkLOI || {};
var BulkLOI = window.BulkLOI;

BulkLOI.bulkGenerateLOIs = async function (deals, globalToneStyle) {
  const outputContainer = document.getElementById("bulk-loi-output");
  outputContainer.innerHTML = "Loading...";

  const toneTemplates = await preloadTones();
  outputContainer.innerHTML = "";

  for (let index = 0; index < deals.length; index++) {
    const deal = deals[index];

    const actualToneStyle = deal.toneStyle || globalToneStyle;

    const sellerFinanceLOI = generateLOI(deal, "sellerFinance", actualToneStyle, toneTemplates);

    // Fallback tone for cash if selected tone doesn't exist
    let cashTone = actualToneStyle;
    const cashKey = `cash-${normalizeTone(cashTone)}`;
    if (!toneTemplates[cashKey]) {
      cashTone = "professional";
    }

    const cashLOI = generateLOI(deal, "cash", cashTone, toneTemplates);

    const fullAddress = deal["Full Address"] || `Deal #${index + 1}`;
    const container = document.createElement("div");
    container.className = "deal-loi-container border rounded-lg mb-4 shadow";

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

    const sfBlock = createOfferBlock("Seller Finance LOI", sellerFinanceLOI);
    const cashBlock = createOfferBlock("Cash Offer LOI", cashLOI);

    content.appendChild(sfBlock);
    content.appendChild(cashBlock);
    container.appendChild(header);
    container.appendChild(content);
    outputContainer.appendChild(container);
  }
};

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
    } catch (err) {
      console.warn(`Tone template not found: ${key}`);
    }
  }
  return tones;
}
