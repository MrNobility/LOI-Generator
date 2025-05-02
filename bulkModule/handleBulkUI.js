window.BulkLOI = window.BulkLOI || {};

/**
 * Grabs DOM input values and triggers the bulk LOI generation.
 */
BulkLOI.handleBulkGenerate = function() {
  const tsvText = document.getElementById('tsvInput')?.value || "";
  const globalOfferType = document.getElementById('globalOfferType')?.value || "Seller Finance";
  const globalToneStyle = document.getElementById('globalToneStyle')?.value || "professional";

  const deals = BulkLOI.parseTSVInput(tsvText);
  if (deals.length === 0) {
    alert("No deals were parsed from the TSV input. Please check your format.");
    return;
  }

  BulkLOI.bulkGenerateLOIs(deals, globalOfferType, globalToneStyle);
};
