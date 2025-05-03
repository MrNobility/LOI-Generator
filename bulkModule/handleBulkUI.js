// ✅ Updated handleBulkUI.js

window.BulkLOI = window.BulkLOI || {};
var BulkLOI = window.BulkLOI;

/**
 * Grabs DOM input values and triggers the bulk LOI generation.
 */
BulkLOI.handleBulkGenerate = function () {
  const tsvText = document.getElementById('tsvInput')?.value || "";

  const globalOfferType = normalizeOfferType(
    document.getElementById('globalOfferType')?.value || "Seller Finance"
  );

  const globalToneStyle = normalizeTone(
    document.getElementById('globalToneStyle')?.value || "professional"
  );

  const deals = BulkLOI.parseTSVInput(tsvText);

  if (deals.length === 0) {
    alert("No deals were parsed from the TSV input. Please check your format.");
    return;
  }

  BulkLOI.bulkGenerateLOIs(deals, globalOfferType, globalToneStyle);
};

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
  return map[input?.trim()] || "professional";
}

function normalizeOfferType(input) {
  if (!input) return "sellerFinance";
  const normalized = input.trim().toLowerCase();
  if (normalized.includes("cash")) return "cash";
  return "sellerFinance";
} 
