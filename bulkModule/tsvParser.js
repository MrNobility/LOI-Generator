function parseTSVInput(tsvText) {
  const lines = tsvText.trim().split('\n').filter(Boolean);
  const rows = lines.map(line => line.split('\t'));

  if (!rows.length) return [];

  const headersPresent = rows[0][0]?.toLowerCase().includes("timestamp");
  if (headersPresent) rows.shift(); // skip header row

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
      "offerType": row[30],     // optional override
      "toneStyle": row[31],     // optional override
      "__rowIndex": i + 1
    };
    return deal;
  });
}
