document.addEventListener("DOMContentLoaded", function () {
  const tsvRowInput = document.getElementById("tsvRowInput");
  const generateSingleBtn = document.getElementById("generate-single-btn");

  const offerTypeSelect = document.getElementById("offer-type");
  const toneStyleSelect = document.getElementById("tone-style");

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

  // 🚫 Removed bulk logic from here.
  // Bulk generation is now handled directly in index.html via onclick
});

