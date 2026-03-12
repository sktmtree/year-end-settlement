export function calculateEarnedIncomeDeduction(totalSalary: number) {
    if (totalSalary <= 5000000) return Math.floor(totalSalary * 0.7);
    if (totalSalary <= 15000000) return Math.floor(3500000 + (totalSalary - 5000000) * 0.4);
    if (totalSalary <= 45000000) return Math.floor(7500000 + (totalSalary - 15000000) * 0.15);
    if (totalSalary <= 100000000) return Math.floor(12000000 + (totalSalary - 45000000) * 0.05);
    return Math.floor(14750000 + (totalSalary - 100000000) * 0.02);
}

export function getTaxRateInfo(taxBase: number) {
    if (taxBase <= 14000000) return { rate: 6, deduction: 0 };
    if (taxBase <= 50000000) return { rate: 15, deduction: 1260000 };
    if (taxBase <= 88000000) return { rate: 24, deduction: 5760000 };
    if (taxBase <= 150000000) return { rate: 35, deduction: 15440000 };
    if (taxBase <= 300000000) return { rate: 38, deduction: 19940000 };
    if (taxBase <= 500000000) return { rate: 40, deduction: 25940000 };
    if (taxBase <= 1000000000) return { rate: 42, deduction: 35940000 };
    return { rate: 45, deduction: 65940000 };
}

export function calculateTax(taxBase: number) {
    const info = getTaxRateInfo(taxBase);
    return Math.floor(taxBase * (info.rate / 100)) - info.deduction;
}

export function calculateAutoInsurance(totalSalary: number) {
    const pension = totalSalary * 0.0475;
    const health = totalSalary * 0.03595;
    const care = health * 0.1314;
    const employment = totalSalary * 0.009;
    return Math.floor(pension + health + care + employment);
}

export function calculateEarnedIncomeTaxCredit(calculatedTax: number, totalSalary: number) {
    let baseCredit = calculatedTax <= 1300000
        ? Math.floor(calculatedTax * 0.55)
        : Math.floor(715000 + (calculatedTax - 1300000) * 0.3);

    let limit = 740000;
    if (totalSalary <= 33000000) {
        limit = 740000;
    } else if (totalSalary <= 70000000) {
        limit = Math.floor(Math.max(660000, 740000 - (totalSalary - 33000000) * 0.008));
    } else {
        limit = Math.floor(Math.max(500000, 660000 - (totalSalary - 70000000) * 0.5));
    }

    return {
        baseCredit,
        limit,
        finalCredit: Math.min(baseCredit, limit)
    };
}
