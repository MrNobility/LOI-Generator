function handleBulkGenerate() {
  const tsvText = document.getElementById('tsvInput').value;
  const globalOfferType = document.getElementById('globalOfferType').value;
  const globalToneStyle = document.getElementById('globalToneStyle').value;

  const deals = parseTSVInput(tsvText);
  bulkGenerateLOIs(deals, globalOfferType, globalToneStyle);
}
