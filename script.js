document.addEventListener("DOMContentLoaded", function () {
    const toneMap = {
      "Market Reality": "marketReality",
      "Professional": "professional",
      "Cash Offer": "cash"
    };
  
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
  
      const listPrice = parseFloat(values[3] || 0);
      const purchaseField = document.getElementById("purchasePrice");
      const offerType = document.getElementById("offerType").value;
  
      // Only apply 68% logic for Cash Offer type
      if (offerType === "Cash Offer" && !purchaseField.value && !isNaN(listPrice)) {
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
      const tonePretty = document.getElementById("offerType").value;
      const toneFile = "tones/" + toneMap[tonePretty] + ".json";
  
      const formData = {
        agent: document.getElementById("agentName").value,
        address: document.getElementById("propertyAddress").value,
        price: formatCurrency(document.getElementById("purchasePrice").value),
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
        document.getElementById("output").innerHTML = "Failed to load tone template.";
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
  