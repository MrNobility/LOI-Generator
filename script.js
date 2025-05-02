document.addEventListener("DOMContentLoaded", function () {
  const offerToTones = {
    sellerFinance: [
      { label: "Market Reality", value: "marketReality" },
      { label: "Professional", value: "professional" }
    ],
    cash: [
      { label: "Professional", value: "professional" }
    ]
  };

  const offerTypeSelect = document.getElementById("offerType");
  const toneStyleSelect = document.getElementById("toneStyle");

  function populateToneOptions() {
    const offer = offerTypeSelect.value;
    toneStyleSelect.innerHTML = "";

    if (!offerToTones[offer]) return;

    offerToTones[offer].forEach(tone => {
      const option = document.createElement("option");
      option.value = tone.value;
      option.textContent = tone.label;
      toneStyleSelect.appendChild(option);
    });
  }

  offerTypeSelect.addEventListener("change", populateToneOptions);
  populateToneOptions(); // run once on load

  const fieldMap = {
    1: "propertyAddress",
    2: "purchasePrice",
    3: "listedPrice",
    5: "downPayment",
    6: "interestRate",
    7: "monthlyPayment",
    8: "balloonTerm",
    9: "amortization",
    10: "insurance",
    11: "taxes",
    18: "closeEscrow",
    19: "emd"
  };

  document.getElementById("parseBtn").addEventListener("click", function () {
    const raw = document.getElementById("tsvInput").value.trim();
    const values = raw.split("\t");

    for (const [i, id] of Object.entries(fieldMap)) {
      if (values[i]) {
        const field = document.getElementById(id);
        if (field) field.value = values[i].trim();
      }
    }

    const listPrice = parseFloat(values[4] || 0);
    const purchaseField = document.getElementById("purchasePrice");
    const offerType = offerTypeSelect.value;
   
  if (offerType === "cash") {
  const rawTSV = document.getElementById("tsvInput").value.trim();
  const tsvValues = rawTSV.split("\t");
  const listPrice = parseFloat(tsvValues[3] || 0);
  if (!isNaN(listPrice)) {
    const calc = (listPrice * 0.68).toFixed(0);
    document.getElementById("purchasePrice").value = calc;

    // ✅ Immediately override in formData
    formData.price = formatCurrency(calc);
  }
}

    if (offerType === "cash" && !purchaseField.value && !isNaN(listPrice)) {
      purchaseField.value = (listPrice * 0.68).toFixed(0);
    }
  });

  function formatCurrency(value) {
    const number = parseFloat(value);
    return isNaN(number) ? '' : new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(number);
  }

document.getElementById("generateBtn").addEventListener("click", async function () {
  const offerType = offerTypeSelect.value;

  // 🧠 Recalculate Purchase Price = 68% of Listed Price if offer is cash
  let calcPrice = document.getElementById("purchasePrice").value; // fallback

  if (offerType === "cash") {
    const rawTSV = document.getElementById("tsvInput").value.trim();
    const tsvValues = rawTSV.split("\t");
    const listPrice = parseFloat(tsvValues[4] || 0); // List Price = TSV column 5
    if (!isNaN(listPrice)) {
      calcPrice = (listPrice * 0.68).toFixed(0);
      document.getElementById("purchasePrice").value = calcPrice;
    }
  }

  const tone = toneStyleSelect.value;
  const toneFile = `tones/${offerType}-${tone}.json`;

let calcPrice = document.getElementById("purchasePrice").value;

if (offerType === "cash") {
  const rawTSV = document.getElementById("tsvInput").value.trim();
  const tsvValues = rawTSV.split("\t");
  const listPrice = parseFloat(tsvValues[4] || 0); // column 5 = index 4
  if (!isNaN(listPrice)) {
    calcPrice = (listPrice * 0.68).toFixed(0);
    document.getElementById("purchasePrice").value = calcPrice;
  }
}

  
  const formData = {
    agent: document.getElementById("agentName").value,
    address: document.getElementById("propertyAddress").value,
    price: formatCurrency(calcPrice),
    down: formatCurrency(document.getElementById("downPayment").value),
    monthly: formatCurrency(document.getElementById("monthlyPayment").value),
    rate: parseFloat(document.getElementById("interestRate").value || 0).toFixed(2) + '%',
    balloon: document.getElementById("balloonTerm").value + " years",
    amort: document.getElementById("amortization").value + " years",
    insurance: formatCurrency(document.getElementById("insurance").value),
    taxes: formatCurrency(document.getElementById("taxes").value),
    closeEscrow: document.getElementById("closeEscrow").value,
    emd: formatCurrency(document.getElementById("emd").value),
    yourName: document.getElementById("yourName").value,
    yourPhone: document.getElementById("yourPhone").value,
    yourEmail: document.getElementById("yourEmail").value
  };

  try {
    const response = await fetch(toneFile);
    if (!response.ok) throw new Error("Tone file not found: " + toneFile);
    const toneData = await response.json();

    const body = toneData.sections.map(section => {
      return section.replace(/{{(\w+?)}}/g, (_, key) => formData[key] || '');
    }).join("<br><br>");

    const subject = toneData.subject.replace(/{{(\w+?)}}/g, (_, key) => formData[key] || '');
    const outputHtml = `<strong>Subject:</strong> ${subject}<br><br>${body}`;

    const outputDiv = document.getElementById("output");
    outputDiv.innerHTML = outputHtml;
    document.getElementById("copyBtn").style.display = "inline-block";

  } catch (err) {
    console.error("Error loading tone file:", err);
    document.getElementById("output").innerHTML = `<div style="color:red;">Failed to load tone template: ${err.message}</div>`;
  }
});


  document.getElementById("copyBtn").addEventListener("click", async function () {
    const htmlContent = document.getElementById("output").innerHTML;
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([htmlContent], { type: "text/html" })
        })
      ]);
      document.getElementById("copyMessage").style.display = "block";
    } catch (err) {
      alert("Copy failed. Please use a supported browser like Chrome or Edge.");
    }
  });
});
