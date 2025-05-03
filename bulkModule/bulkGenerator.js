window.BulkLOI = window.BulkLOI || {};
var BulkLOI = window.BulkLOI;

/**
 * Generates and displays LOIs for each parsed deal.
 * Always includes both Seller Finance and Cash LOIs.
 */
BulkLOI.bulkGenerateLOIs = function(deals, globalOfferType, globalToneStyle) {
  const outputContainer = document.getElementById('bulk-loi-output');
  outputContainer.innerHTML = "";

  deals.forEach((deal, index) => {
    const offerType = deal["offerType"] || globalOfferType;
    const toneStyle = deal["toneStyle"] || globalToneStyle;

    const sellerFinanceLOI = generateLOI({ ...deal, offerType: "Seller Finance", toneStyle });
    const cashLOI = generateLOI({ ...deal, offerType: "Cash", toneStyle });

    const formattedBlock = renderCollapsibleLOIBlock({
      fullAddress: deal["Full Address"] || `Deal #${index + 1}`,
      sellerFinanceLOI,
      cashLOI
    }, index);

    outputContainer.appendChild(formattedBlock);
  });
};

/**
 * Creates a collapsible block for each deal with styled LOI sections.
 */
function renderCollapsibleLOIBlock(dealData, index) {
  const container = document.createElement("div");
  container.className = "deal-loi-container border rounded-lg mb-4 shadow transition";

  // Header toggle button
  const header = document.createElement("button");
  header.className = "deal-header w-full text-left font-semibold text-lg p-3 bg-gray-100 hover:bg-gray-200";
  header.innerHTML = `Deal ${index + 1}: ${dealData.fullAddress || "Unnamed Property"} <span class="toggle-icon">▼</span>`;

  const content = document.createElement("div");
  content.className = "deal-content p-4 hidden transition-all";

  // Toggle functionality
  header.addEventListener("click", () => {
    content.classList.toggle("hidden");
    const icon = header.querySelector(".toggle-icon");
    icon.textContent = content.classList.contains("hidden") ? "▼" : "▲";
  });

  // Seller Finance Block
  const sellerFinanceBlock = document.createElement("div");
  sellerFinanceBlock.className = "seller-finance-block mb-6 p-4 border-l-4 border-blue-400 bg-blue-50 rounded";
  sellerFinanceBlock.innerHTML = `
    <h3 class="font-bold mb-2 text-blue-700">Seller Finance LOI</h3>
    ${dealData.sellerFinanceLOI}
  `;

  // Cash Offer Block
  const cashBlock = document.createElement("div");
  cashBlock.className = "cash-block p-4 border-l-4 border-green-400 bg-green-50 rounded";
  cashBlock.innerHTML = `
    <h3 class="font-bold mb-2 text-green-700">Cash Offer LOI</h3>
    ${dealData.cashLOI}
  `;

  content.appendChild(sellerFinanceBlock);
  content.appendChild(cashBlock);
  container.appendChild(header);
  container.appendChild(content);

  return container;
}
