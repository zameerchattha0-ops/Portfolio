/**
 * SALARY TAX CALCULATOR (FY 2025-26 Estimate)
 * "Auto-Pilot" Mode: Users enter raw data -> System calculates Credits/Perks.
 * Based on Income Tax Ordinance 2001 (Updated for Salary/Perqs/Credits).
 */

/* Accordion Toggle (Global) - Keeps UI clean */
function toggleTaxSection(id) {
    const section = document.getElementById(id);
    section.classList.toggle('open');
}

(function () {
    const btn = document.getElementById('tax-calc-btn');
    const resultArea = document.getElementById('tax-results');

    // --- INPUT MAPPING ---
    const i = {
        // 1. Salary
        basic: document.getElementById('tax-basic'),
        bonus: document.getElementById('tax-bonus'),
        medical: document.getElementById('tax-medical'),
        medicalProvided: document.getElementById('tax-medical-facility'),
        other: document.getElementById('tax-other-allowance'),

        // 2. Perquisites
        carCost: document.getElementById('tax-car-cost'),
        carType: document.getElementById('tax-car-type'), // part/full
        shareFMV: document.getElementById('tax-share-fmv'),
        shareCost: document.getElementById('tax-share-cost'),
        housingProvided: document.getElementById('tax-housing-provided'),
        loanAmount: document.getElementById('tax-loan-amount'),
        loanRate: document.getElementById('tax-loan-rate'),

        // 3. Separate Block
        flying: document.getElementById('tax-flying'),
        termination: document.getElementById('tax-termination'),

        // 4. Deductions (Reduces Income)
        zakat: document.getElementById('tax-zakat'),
        eduFees: document.getElementById('tax-edu-fees'),
        eduKids: document.getElementById('tax-edu-kids'),

        // 5. Investments (For Credits)
        donations: document.getElementById('tax-donations'),
        pension: document.getElementById('tax-pension'),
        housingInterest: document.getElementById('tax-housing-interest'),

        // 6. Rebates (Status)
        teacher: document.getElementById('tax-teacher'),
        senior: document.getElementById('tax-senior')
    };

    if (!btn) return;

    btn.addEventListener('click', calculateTax);

    // Helpers
    function getVal(el) { return el ? (parseFloat(el.value) || 0) : 0; }
    function getBool(el) { return el ? el.checked : false; }
    function format(num) { return "₨ " + Math.round(num).toLocaleString('en-PK'); }

    // Print Button Logic
    const printBtn = document.getElementById('tax-print-btn');
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            window.print();
        });
    }

    function calculateTax() {
        // ==========================================
        // STEP 1: CALCULATE GROSS INCOME
        // ==========================================

        // A. Cash Salary
        let basic = getVal(i.basic); // Annual Input
        let bonus = getVal(i.bonus);
        let other = getVal(i.other);

        // B. Medical Allowance (Exemption Rule)
        let medicalAllowance = getVal(i.medical);
        let medicalTaxable = 0;
        let medicalExempt = 0;

        if (getBool(i.medicalProvided)) {
            // Rule: If facility provided, allowance is 100% taxable
            medicalTaxable = medicalAllowance;
        } else {
            // Rule: Exempt up to 10% of Basic Salary
            let limit = basic * 0.10;
            medicalExempt = Math.min(medicalAllowance, limit);
            medicalTaxable = Math.max(0, medicalAllowance - limit);
        }

        // C. Perquisites (Non-Cash Benefits)

        // 1. Company Car (Sec 13(3))
        let carBenefit = 0;
        let carCost = getVal(i.carCost);
        if (carCost > 0) {
            let rate = i.carType.value === 'full' ? 0.10 : 0.05; // 10% for personal, 5% for part
            carBenefit = carCost * rate;
        }

        // 2. Employee Shares (Sec 14)
        let shareBenefit = 0;
        let fmv = getVal(i.shareFMV);
        let cost = getVal(i.shareCost);
        if (fmv > cost) {
            shareBenefit = fmv - cost;
        }

        // 3. Housing (Rule 5)
        let housingBenefit = 0;
        if (getBool(i.housingProvided)) {
            // Rule: Add 45% of Basic Salary
            housingBenefit = basic * 0.45;
        }

        // 4. Employer Loan (Sec 13(7))
        let loanBenefit = 0;
        let loanPrincipal = getVal(i.loanAmount);
        if (loanPrincipal > 1000000) { // Only if > 1 Million
            let benchmark = 10; // 10% Benchmark
            let charged = getVal(i.loanRate);
            if (charged < benchmark) {
                loanBenefit = loanPrincipal * ((benchmark - charged) / 100);
            }
        }

        let totalSalaryIncome = basic + bonus + other + medicalTaxable + carBenefit + shareBenefit + housingBenefit + loanBenefit;

        // ==========================================
        // STEP 2: DEDUCTIBLE ALLOWANCES
        // ==========================================

        // A. Zakat (Sec 60)
        let zakat = getVal(i.zakat);

        // B. Education Expenses (Sec 60D)
        // Rule: Only if Taxable Income < 1.5M. Limit: Min(5% Fees, 25% Income, 60k/child)
        let eduDeduction = 0;
        let incomeForEdu = totalSalaryIncome - zakat;

        if (incomeForEdu < 1500000) {
            let fees = getVal(i.eduFees);
            let kids = getVal(i.eduKids);
            if (fees > 0) {
                let limit1 = fees * 0.05; // 5% of fees
                let limit2 = incomeForEdu * 0.25; // 25% of income
                let limit3 = 60000 * kids; // 60k per child
                eduDeduction = Math.min(limit1, limit2, limit3);
            }
        }

        let totalDeductions = zakat + eduDeduction;
        let taxableIncome = Math.max(0, totalSalaryIncome - totalDeductions);

        // ==========================================
        // STEP 3: GROSS TAX (SLABS)
        // ==========================================
        let grossTax = calculateSlabTax(taxableIncome);

        // Separate Block Tax (Flying/Submarine)
        let blockIncome = getVal(i.flying); // + Termination (if elected)
        let blockTax = blockIncome * 0.025; // 2.5% Rate

        // ==========================================
        // STEP 4: TAX CREDITS (INVESTMENTS)
        // ==========================================
        // Formula: (Measure / TaxableIncome) * GrossTax

        let avgRate = taxableIncome > 0 ? (grossTax / taxableIncome) : 0;
        let totalCredits = 0;

        // A. Charitable Donations (Sec 61)
        // Limit: Amount donated OR 30% of Taxable Income
        let donAmount = getVal(i.donations);
        let donLimit = taxableIncome * 0.30;
        let eligibleDonation = Math.min(donAmount, donLimit);
        let creditDonation = eligibleDonation * avgRate;

        // B. Pension Fund (Sec 63)
        // Limit: Contribution OR 20% of Taxable Income
        let penAmount = getVal(i.pension);
        let penLimit = taxableIncome * 0.20;
        let eligiblePension = Math.min(penAmount, penLimit);
        let creditPension = eligiblePension * avgRate;

        // C. Housing Loan Markup (Sec 63A)
        // Limit: Markup Paid OR 50% of Taxable Income
        let houseAmount = getVal(i.housingInterest);
        let houseLimit = taxableIncome * 0.50;
        let eligibleHousing = Math.min(houseAmount, houseLimit);
        let creditHousing = eligibleHousing * avgRate;

        totalCredits = creditDonation + creditPension + creditHousing;

        let taxAfterDesc = Math.max(0, grossTax - totalCredits);

        // ==========================================
        // STEP 5: SPECIAL REBATES (REDUCTIONS)
        // ==========================================
        let rebates = 0;

        // A. Teacher / Researcher (25% of Tax Liability)
        if (getBool(i.teacher)) {
            rebates += (taxAfterDesc * 0.25);
        }

        // B. Senior Citizen (50% if Income <= 1M)
        if (getBool(i.senior) && taxableIncome <= 1000000) {
            let reduction = taxAfterDesc * 0.50;
            rebates = Math.max(rebates, reduction); // Usually one applies mostly.
            if (getBool(i.teacher) && getBool(i.senior)) {
                rebates = taxAfterDesc * 0.50; // Conservative: Max 50%.
            }
        }

        let netNormalTax = Math.max(0, taxAfterDesc - rebates);
        let finalLiability = netNormalTax + blockTax;

        // ==========================================
        // RENDER RESULTS (WITH CHART)
        // ==========================================
        renderAuditTrail(totalSalaryIncome, totalDeductions, taxableIncome, grossTax, totalCredits, rebates, blockTax, finalLiability, basic);
    }

    function calculateSlabTax(income) {
        if (income <= 600000) return 0;
        if (income <= 1200000) return (income - 600000) * 0.05;
        if (income <= 2200000) return 30000 + (income - 1200000) * 0.15;
        if (income <= 3200000) return 180000 + (income - 2200000) * 0.25;
        if (income <= 4100000) return 430000 + (income - 3200000) * 0.30;
        return 700000 + (income - 4100000) * 0.35;
    }

    function renderAuditTrail(gross, deductions, taxable, slabTax, credits, rebates, blockTax, finalTax, basicSalary) {

        let monthly = finalTax / 12;
        // Approximation: Cash Inflow (Basic+Bonus+Other+Medical) - Tax
        let cashIncome = basicSalary + getVal(i.bonus) + getVal(i.other) + getVal(i.medical);

        // Safety for Chart Division
        if (cashIncome <= 0) cashIncome = 1;

        let monthlyNet = (cashIncome - finalTax) / 12;

        // CHART DATA
        let taxPercent = (finalTax / cashIncome) * 100;
        let netPercent = 100 - taxPercent;
        if (netPercent < 0) netPercent = 0; // Edge case if tax > income (unlikely but safe)

        // CSS Variables for Chart
        let chartStyle = `--chart-p1: ${taxPercent}%; --chart-color-1: #ef4444; --chart-color-2: #10b981;`;

        let html = `
            <div class="tax-result-header">
                <span style="font-size:0.9em; opacity:0.8;">Tax Calculation Summary</span>
                <div style="font-size:1.8em; font-weight:700; color:var(--primary);">${format(finalTax)}</div>
                <div style="font-size:0.8em;">Total Annual Tax Liability</div>
            </div>

            <!-- VISUAL CHART -->
            <div class="tax-chart-container">
                <div class="tax-chart" style="${chartStyle}"></div>
                <div class="tax-chart-legend">
                    <div class="legend-item">
                        <div class="legend-dot" style="background:#ef4444"></div>
                        <span>Tax (${taxPercent.toFixed(1)}%)</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-dot" style="background:#10b981"></div>
                        <span>Take Home (${netPercent.toFixed(1)}%)</span>
                    </div>
                </div>
            </div>

            <div class="audit-trail">
                <!-- 1. Income -->
                <div class="audit-row">
                    <span>Total Income (Salary + Perks)</span>
                    <span>${format(gross)}</span>
                </div>
                <!-- 2. Deductions -->
                ${deductions > 0 ? `
                <div class="audit-row text-green">
                    <span>Less: Zakat / Edu. Deductions</span>
                    <span>- ${format(deductions)}</span>
                </div>` : ''}
                
                <div class="audit-row strong" style="border-top:1px dashed var(--border); margin-top:4px; padding-top:4px;">
                    <span>Taxable Income</span>
                    <span>${format(taxable)}</span>
                </div>

                <!-- 3. Tax -->
                <div class="audit-row" style="margin-top:8px;">
                    <span>Gross Tax (Per Slabs)</span>
                    <span>${format(slabTax)}</span>
                </div>

                <!-- 4. Credits -->
                ${credits > 0 ? `
                <div class="audit-row text-green">
                    <span>Less: Investment Credits</span>
                    <span>- ${format(credits)}</span>
                </div>` : ''}

                <!-- 5. Rebates -->
                ${rebates > 0 ? `
                <div class="audit-row text-green">
                    <span>Less: Special Rebates</span>
                    <span>- ${format(rebates)}</span>
                </div>` : ''}

               <!-- 6. Block Tax -->
               ${blockTax > 0 ? `
                <div class="audit-row text-red">
                    <span>Add: Separate Block Tax</span>
                    <span>+ ${format(blockTax)}</span>
                </div>` : ''}
            </div>

            <!-- FINAL SUMMARY -->
            <div class="tax-monthly-card">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span>Avg. Monthly Deduction</span>
                    <span style="font-weight:bold; color:#ef4444;">${format(monthly)}</span>
                </div>
                <div style="background:rgba(255,255,255,0.5); height:1px; margin:8px 0;"></div>
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span>Est. Monthly Take Home</span>
                    <span style="font-weight:bold; color:var(--primary-dark);">${format(monthlyNet)}</span>
                </div>
            </div>

             <div class="tax-badge-container">
                <div class="tax-badge tax-badge--${getBadgeInfo(taxable).level}">
                    <span class="tax-badge__emoji">${getBadgeInfo(taxable).emoji}</span>
                    <div class="tax-badge__text">
                        <span class="tax-badge__title">${getBadgeInfo(taxable).title}</span>
                        <span class="tax-badge__sub">${getBadgeInfo(taxable).sub}</span>
                    </div>
                </div>
            </div>
        `;

        resultArea.innerHTML = html;
        resultArea.style.display = 'block';

        // Show Print Button
        if (printBtn) printBtn.style.display = 'block';

        // Add minimal animation
        resultArea.animate([
            { opacity: 0, transform: 'translateY(10px)' },
            { opacity: 1, transform: 'translateY(0)' }
        ], { duration: 300, easing: 'ease-out' });
    }

    function getBadgeInfo(income) {
        if (income <= 600000) return { emoji: '🟢', title: 'Tax Free!', sub: 'You owe nothing — enjoy your full salary!', level: 'green' };
        if (income <= 1200000) return { emoji: '🌱', title: 'Slab 2 — Light', sub: 'Just 5% — barely a scratch.', level: 'green' };
        if (income <= 2200000) return { emoji: '💼', title: 'Slab 3 — Steady', sub: '15% bracket. Solid professional range.', level: 'blue' };
        if (income <= 3200000) return { emoji: '⚡', title: 'Slab 4 — Elite', sub: '25% bracket. You\'re in the big leagues.', level: 'purple' };
        if (income <= 4100000) return { emoji: '🔥', title: 'Slab 5 — Power', sub: '30% bracket. High earner territory!', level: 'orange' };
        return { emoji: '👑', title: 'Slab 6 — Top Bracket', sub: '35% — The pinnacle of income tax.', level: 'red' };
    }

})();
