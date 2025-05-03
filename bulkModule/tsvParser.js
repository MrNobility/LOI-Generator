window.BulkLOI = window.BulkLOI || {};
var BulkLOI = window.BulkLOI;

BulkLOI.parseTSVInput = function(tsvText) {
  const cleanedText = tsvText.replace(/^\ufeff/, '');
  const lines = cleanedText.trim().split('\n').filter(line => line.trim() !== "");
  const rows = lines.map(line => line.split('\t'));

  if (!rows.length || rows[0].length < 2) {
    console.error("TSV data is empty or malformed. Raw rows:", rows);
    return [];
  }

  const headersPresent = rows[0][0].toLowerCase().includes("timestamp");
  if (headersPresent) rows.shift();

  return rows.map((row, i) => {
    return {
      "TimeStamp": row[0],
      "Full Address": row[1]?.trim(),
      "Purchase Price": parseFloat(row[2]),
      "Listed Price": parseFloat(row[3]),
      "% of List Price": row[4],
      "Down Payment": row[5],
      "Interest Rate": row[6],
      "Monthly Payment (PITI)": row[7],
      "Balloon Term": row[8],
      "Amortization": row[9],
      "Monthly Insurance": row[10],
      "Monthly Taxes": row[11],
      "Close of Escrow": row[18],
      "EMD": row[19],
      "offerType": row[30]?.trim().toLowerCase().includes("cash") ? "cash" : "sellerFinance",
      "toneStyle": normalizeTone(row[31]?.trim()),
      "yourName": "Dalton Eddleman",
      "yourPhone": "512-265-5448",
      "yourEmail": "Mr.Nobility@nobility.network",
      "agent": "",
      "__rowIndex": i + 1
    };
  });
};

// Map human-readable tone names to internal keys
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
  return map[input] || "professional";
}
