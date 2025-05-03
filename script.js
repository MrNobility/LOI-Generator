// ✅ Updated script.js

// Handles SINGLE deal generation UI and output logic

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
  populateToneOptions();

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
    const raw = document.getElementById("tsvRowInput").value.trim();
    const values = raw.split("\t");

    if (values.length < 20) {
      alert("⚠️ This TSV row looks incomplete. Please double-check your input.");
      return;
    }

    for (const [i, id] of Object.entries(fieldMap)) {
      if (values[i]) {
        const field = document.getElementById(id);
        if (field) field.value = values[i].trim();
      }
    }

    const offerType = document.getElementById("offerType").value;
    const listPrice = parseFloat(values[3] || 0);
    if (offerType === "cash" && !isNaN(listPrice) && listPrice > 0) {
      const calc = (listPrice * 0.68).toFixed(0);
      document.getElementById("purchasePrice").value = calc;
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
    const tone = toneStyleSelect.value;

    const calcPurchasePrice = (() => {
      const entered = parseFloat(document.getElementById("purchasePrice").value || 0);
      const listed = parseFloat(document.getElementById("listedPrice").value || 0);
      if (offerType === "cash" && listed > 0) return listed * 0.68;
      return entered;
    })();

    const formData = {
      agent: document.getElementById("agentName").value,
      address: document.getElementById("propertyAddress").value,
      price: formatCurrency(calcPurchasePrice),
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

    const toneFile = `tones/${offerType}-${tone}.json`;

    try {
      const response = await fetch(toneFile);
      if (!response.ok) throw new Error("Tone file not found: " + toneFile);
      const toneData = await response.json();

      const outputContainer = document.getElementById("output");
      outputContainer.innerHTML = "";

      const card = document.createElement("div");
      card.className = "loi-card";

      const content = document.createElement("div");
      content.className = "loi-content";
      const filled = toneData.sections.map(section =>
        section.replace(/{{(\w+?)}}/g, (_, key) => formData[key] || '')
      ).join("<br><br>");
      const subject = toneData.subject.replace(/{{(\w+?)}}/g, (_, key) => formData[key] || '');

      content.innerHTML = `<strong>Subject:</strong> ${subject}<br><br>${filled}`;

      const copyBtn = document.createElement("button");
      copyBtn.className = "px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600";
      copyBtn.textContent = "Copy to Clipboard";
      copyBtn.addEventListener("click", async () => {
        await navigator.clipboard.write([
          new ClipboardItem({
            "text/html": new Blob([content.innerHTML], { type: "text/html" })
          })
        ]);
        copyBtn.textContent = "Copied!";
        setTimeout(() => (copyBtn.textContent = "Copy to Clipboard"), 1500);
      });

      card.appendChild(content);
      card.appendChild(copyBtn);
      outputContainer.appendChild(card);
    } catch (err) {
      console.error("Error loading tone file:", err);
      document.getElementById("output").innerHTML = `<div style="color:red;">Failed to load tone template: ${err.message}</div>`;
    }
  });
});
