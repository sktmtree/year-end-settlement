export interface TaxInputs {
    salary: string;
    nonTaxable: string;
    dependents: string;
    insurance: string;
    housing: string;
    creditCard: string;
    debitCard: string;
    cashReceipt: string;
    publicTransport: string;
    traditionalMarket: string;
    donation: string;
    monthlyRent: string;
    otherExpenses: string;
    prepaidTax: string;
}

export interface TaxResult {
    totalSalary: number;
    autoInsurance: number;
    earnedIncomeDeduction: number;
    earnedIncome: number;
    threshold: number;
    totalCardSpend: number;
    cardDeductionAmount: number;

    dependents: number;
    personalDeduction: number;

    insuranceSpent: number;
    insuranceDeduction: number;

    housingSpent: number;
    housingDeduction: number;

    totalIncomeDeduction: number;
    taxBase: number;
    calculatedTax: number;
    taxInfo: { rate: number; deduction: number };
    earnedIncomeTaxCreditInfo: { baseCredit: number; limit: number; finalCredit: number };
    earnedIncomeTaxCredit: number;

    donationSpent: number;
    donationCredit: number;

    rentSpent: number;
    rentCredit: number;

    otherSpent: number;
    otherCredit: number;

    smeCredit: number;
    totalTaxCredits: number;
    finalTax: number;
    prepaidTax: number;
    refundOrPay: number;
}
