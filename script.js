document.addEventListener("DOMContentLoaded", function () {
  const tsvRowInput = document.getElementById("tsvRowInput");
  const tsvInput = document.getElementById("tsvInput");

  const generateSingleBtn = document.getElementById("generate-single-btn");
  const generateBulkBtn = document.getElementById("generate-bulk-btn");

  const offerTypeSelect = document.getElementById("offer-type");
  const toneStyleSelect = document.getElementById("tone-style");

  const bulkToneSelect = document.getElementById("bulk-tone-style");

  generateSingleBtn.addEventListener("click", function () {
    const tsvLine = tsvRowInput.value.trim();
    if (!tsvLine) {
      alert("Please paste a TSV line first.");
      return;
    }

    const parsedDeals = BulkLOI.parseTSVInput(tsvLine);
    if (!parsedDeals.length) {
      alert("Could not parse TSV line.");
      return;
    }

    const deal = parsedDeals[0];
    const offerType = offerTypeSelect.value;
    const toneStyle = toneStyleSelect.value;

    BulkLOI.singleGenerateLOI(deal, offerType, toneStyle);
  });

  generateBulkBtn.addEventListener("click", function () {
    const tsvText = tsvInput.value.trim();
    if (!tsvText) {
      alert("Please paste multiple TSV rows first.");
      return;
    }

    const deals = BulkLOI.parseTSVInput(tsvText);
    if (!deals.length) {
      alert("No deals found in input.");
      return;
    }

    const globalToneStyle = bulkToneSelect.value;
    BulkLOI.bulkGenerateLOIs(deals, globalToneStyle);
  });
});
