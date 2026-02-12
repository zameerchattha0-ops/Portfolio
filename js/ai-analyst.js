(function () {
    const btn = document.getElementById('ai-analyze-btn');
    const resultsArea = document.getElementById('ai-results');
    const scanBar = document.getElementById('ai-scan-bar');
    const statusText = document.getElementById('ai-status');
    const insightText = document.getElementById('ai-insight');
    const marginVal = document.getElementById('metric-margin');
    const ratioVal = document.getElementById('metric-ratio');

    const inputs = {
        rev: document.getElementById('in-rev'),
        exp: document.getElementById('in-exp'),
        assets: document.getElementById('in-assets'),
        liab: document.getElementById('in-liab')
    };

    if (!btn) return;

    btn.addEventListener('click', function () {
        // Simple Validation
        const rev = parseFloat(inputs.rev.value) || 0;
        const exp = parseFloat(inputs.exp.value) || 0;
        const assets = parseFloat(inputs.assets.value) || 0;
        const liab = parseFloat(inputs.liab.value) || 0;

        if (rev === 0 && assets === 0) {
            alert("Please input at least Revenue or Assets to analyze.");
            return;
        }

        // 1. Reset & Start Scanning Effect
        resultsArea.classList.remove('visible');
        btn.disabled = true;
        btn.textContent = "SCANNING...";

        // Use a temporary overlay or just show the bar?
        // Let's show the results area immediately but clearing text
        resultsArea.classList.add('visible');
        scanBar.classList.remove('scanning');
        void scanBar.offsetWidth; // trigger reflow
        scanBar.classList.add('scanning');

        statusText.textContent = "INITIALIZING NEURAL LINK...";
        insightText.textContent = "";
        marginVal.textContent = "--";
        ratioVal.textContent = "--";

        // Simulated Processing Steps
        setTimeout(() => statusText.textContent = "PARSING FINANCIAL VECTORS...", 600);
        setTimeout(() => statusText.textContent = "CALCULATING SOLVENCY RATIOS...", 1200);
        setTimeout(() => statusText.textContent = "GENERATING STRATEGIC INFERENCE...", 1800);

        setTimeout(() => {
            // 2. Perform Calculations
            const margin = rev > 0 ? ((rev - exp) / rev) * 100 : 0;
            const currentRatio = liab > 0 ? assets / liab : 0;

            // 3. Generate Insight (Rule-Based AI)
            let insight = "";
            let risk = "LOW";

            // Logic Tree
            if (margin < 5) {
                insight += "PROFITABILITY WARNING: Net margin is critically low. Immediate OPEX audit recommended. ";
                risk = "HIGH";
            } else if (margin > 20) {
                insight += "STRONG EFFICIENCY: Margins exceed industry averages. Logic suggests reinvestment in growth. ";
            } else {
                insight += "STABLE OPERATIONS: Margins are healthy. ";
            }

            if (currentRatio < 1.0) {
                insight += "LIQUIDITY ALERT: Current assets insufficient to cover short-term debt. Cash flow injection required.";
                risk = "HIGH";
            } else if (currentRatio > 2.0) {
                insight += "CAPITAL INEFFICIENCY DETECTED: Excess liquidity found. Suggest deploying capital into higher-yield vehicles.";
            } else {
                insight += "SOLVENCY OPTIMAL: Balance sheet structure is sound.";
            }

            // 4. Update UI
            marginVal.textContent = margin.toFixed(1) + '%';
            ratioVal.textContent = currentRatio.toFixed(2);
            insightText.textContent = `[RISK LEVEL: ${risk}] // ${insight}`;

            statusText.textContent = "ANALYSIS COMPLETE.";
            scanBar.classList.remove('scanning');
            btn.disabled = false;
            btn.textContent = "RUN ANALYSIS";

        }, 2100); // 2.1s total delay
    });

})();
