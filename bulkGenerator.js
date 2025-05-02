function bulkGenerateLOIs(deals, globalOfferType, globalToneStyle) {
  const outputContainer = document.getElementById('bulk-loi-output');
  outputContainer.innerHTML = "";

  deals.forEach((deal, index) => {
    const offerType = deal["offerType"] || globalOfferType;
    const toneStyle = deal["toneStyle"] || globalToneStyle;

    const sellerFinanceLOI = generateLOI({ ...deal, offerType: "Seller Finance", toneStyle });
    const cashLOI = generateLOI({ ...deal, offerType: "Cash", toneStyle });

    const dealOutput = document.createElement('details');
    dealOutput.innerHTML = `
      <summary><strong>LOIs for: ${deal["Full Address"] || `Deal #${index + 1}`}</strong></summary>
      <div class="loi-block">
        <h4>Seller Finance</h4>
        <div class="loi-content">${sellerFinanceLOI}</div>
        <h4>Cash Offer</h4>
        <div class="loi-content">${cashLOI}</div>
      </div>
    `;
    outputContainer.appendChild(dealOutput);
  });
}
