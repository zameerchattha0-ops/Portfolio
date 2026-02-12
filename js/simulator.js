(function () {
    // Select Elements
    const inputs = {
        initial: document.getElementById('sim-initial'),
        monthly: document.getElementById('sim-monthly'),
        rate: document.getElementById('sim-rate'),
        years: document.getElementById('sim-years')
    };

    const displays = {
        initial: document.getElementById('val-initial'),
        monthly: document.getElementById('val-monthly'),
        rate: document.getElementById('val-rate'),
        years: document.getElementById('val-years'),
        result: document.getElementById('sim-result'),
        invested: document.getElementById('sim-invested')
    };

    const bars = {
        invested: document.getElementById('bar-invested'),
        growth: document.getElementById('bar-growth')
    };

    // Format Currency
    const fmt = new Intl.NumberFormat('en-PK', {
        style: 'currency',
        currency: 'PKR',
        maximumFractionDigits: 0
    });

    function calculate() {
        const P = parseFloat(inputs.initial.value);
        const PMT = parseFloat(inputs.monthly.value);
        const r = parseFloat(inputs.rate.value) / 100;
        const t = parseFloat(inputs.years.value);
        const n = 12; // Monthly compounding

        // Future Value Formula: FV = P(1 + r/n)^(nt) + PMT * [ (1 + r/n)^(nt) - 1 ] / (r/n)
        const compoundFactor = Math.pow(1 + r / n, n * t);
        const fvInitial = P * compoundFactor;
        const fvMonthly = PMT * (compoundFactor - 1) / (r / n);
        const totalFV = fvInitial + fvMonthly;

        const totalInvested = P + (PMT * 12 * t);
        const totalInterest = totalFV - totalInvested;

        // Update UI
        displays.initial.textContent = fmt.format(P);
        displays.monthly.textContent = fmt.format(PMT);
        displays.rate.textContent = (r * 100).toFixed(1) + '%';
        displays.years.textContent = t + ' Years';

        displays.result.textContent = fmt.format(totalFV);
        displays.invested.textContent = fmt.format(totalInvested);

        // Update Chart
        // Normalize heights (max chart height is 100%)
        // We set growth bar relative to invested for visual effect
        // Or better: max height corresponds to FV.
        // Let's make bars proportional.

        let maxVal = totalFV;
        if (maxVal === 0) maxVal = 1;

        const hInvested = (totalInvested / maxVal) * 100;
        const hGrowth = (totalInterest / maxVal) * 100; // Actually total height is FV, so stacked?

        // Let's do side-by-side or stacked? Side by side is easier with current HTML
        // Wait, current HTML has them as separate bars.
        // Let's make Growth represent the GAIN, invested represent PRINCIPAL.
        // But visually, FV is the sum.
        // Let's make Invested Bar height % of FV, Growth Bar height % of FV? No.
        // A better visual is: Bar 1 = Invested, Bar 2 = Total FV.
        // Let's change this on the fly: make Bar 2 the TOTAL.

        bars.invested.style.height = `${Math.max(5, (totalInvested / totalFV) * 100)}%`;
        bars.growth.style.height = '100%'; // The container is the limit? No.

        // Actually, let's just make Bar 1 = Invested, Bar 2 = Interest.
        // They should be stacked to show total?
        // Let's stick to the current CSS: they are side-by-side. 
        // Bar 1: Principal. Bar 2: Interest.
        // Relative to Total FV.
        bars.invested.style.height = `${(totalInvested / totalFV) * 100}%`;
        bars.growth.style.height = `${(totalInterest / totalFV) * 100}%`;
    }

    // Attach Listeners
    Object.values(inputs).forEach(input => {
        if (input) input.addEventListener('input', calculate);
    });

    // Init
    calculate();

})();
