function parseTSVInput(tsvText) {
  const lines = tsvText.trim().split('\n').filter(line => line.trim() !== "");
  const rows = lines.map(line => line.split('\t'));

  if (!rows.length || !Array.isArray(rows[0]) || rows[0].length < 2) {
    console.error("TSV input is malformed or missing data.");
    return [];
  }

  const headersPresent = rows[0][0]?.toLowerCase().includes("timestamp");
  if (headersPresent) rows.shift(); // Remove header row if present

  return rows.map((row, i) => {
    const deal = {
      "Full Address": row[1]?.trim(),
      "Purchase Price": row[2],
      "Listed Price": row[3],
      "Down Payment": row[5],
      "Interest Rate": row[6],
      "Monthly Payment (PITI)": row[7],
      "Balloon Term": row[8],
      "Amortization": row[9],
      "Monthly Insurance": row[10],
      "Monthly Taxes": row[11],
      "Close of Escrow": row[18],
      "EMD": row[19],
      "offerType": row[30],
      "toneStyle": row[31],
      "__rowIndex": i + 1
    };
    return deal;
  });
}
