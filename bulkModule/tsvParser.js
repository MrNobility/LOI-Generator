function parseTSVInput(tsvText) {
  const lines = tsvText.trim().split('\n').filter(Boolean);
  const rows = lines.map(line => line.split('\t'));

  const hasHeaders = isNaN(Number(rows[0][1])) === false ? false : true;
  let headers = hasHeaders ? rows.shift() : null;

  const defaultHeaders = [
    "Full Address", "Purchase Price", "Listed Price", "Down Payment",
    "Interest Rate", "Monthly Payment (PITI)", "Balloon Term",
    "Amortization", "Monthly Insurance", "Monthly Taxes", "Close of Escrow",
    "EMD", "offerType", "toneStyle"
  ];

  return rows.map((row, i) => {
    const deal = {};
    (headers || defaultHeaders).forEach((key, index) => {
      deal[key] = row[index]?.trim() || "";
    });
    deal.__rowIndex = i + 1;
    return deal;
  });
}
