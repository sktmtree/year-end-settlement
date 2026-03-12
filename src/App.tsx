import React, { useState, useMemo } from 'react';
import { Calculator, Building2 } from 'lucide-react';
import { calculateEarnedIncomeDeduction, getTaxRateInfo, calculateTax, calculateEarnedIncomeTaxCredit, calculateAutoInsurance } from './utils/taxCalculator';
import InputSection from './components/InputSection';
import ResultSection from './components/ResultSection';
import type { TaxInputs } from './types';

export default function App() {
  const [inputs, setInputs] = useState<TaxInputs>({
    salary: '',
    nonTaxable: '',
    dependents: '0',
    insurance: '',
    housing: '',
    creditCard: '',
    debitCard: '',
    cashReceipt: '',
    publicTransport: '',
    traditionalMarket: '',
    donation: '',
    monthlyRent: '',
    otherExpenses: '',
    prepaidTax: ''
  });

  const [isSmeEmployee, setIsSmeEmployee] = useState(false);
  const [expandedPhase, setExpandedPhase] = useState<number | null>(1);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = value.replace(/[^0-9]/g, '');
    setInputs({ ...inputs, [name]: numValue });
  };

  const parseOrZero = (val: string) => parseInt(val, 10) || 0;

  const result = useMemo(() => {
    const salary = parseOrZero(inputs.salary);
    const nonTaxable = parseOrZero(inputs.nonTaxable);

    // 1. 총급여액
    const totalSalary = Math.max(0, salary - nonTaxable);

    // 2. 근로소득금액
    const earnedIncomeDeduction = calculateEarnedIncomeDeduction(totalSalary);
    const earnedIncome = Math.max(0, totalSalary - earnedIncomeDeduction);

    // 3. 소득공제 (카드류)
    const threshold = totalSalary * 0.25;
    const creditSpent = parseOrZero(inputs.creditCard);
    const debitSpent = parseOrZero(inputs.debitCard) + parseOrZero(inputs.cashReceipt);
    const transitMarketSpent = parseOrZero(inputs.publicTransport) + parseOrZero(inputs.traditionalMarket);

    const totalCardSpend = creditSpent + debitSpent + transitMarketSpent;
    let cardDeductionAmount = 0;

    if (totalCardSpend > threshold) {
      let remainingThreshold = threshold;
      const creditToDeduct = Math.max(0, creditSpent - remainingThreshold);
      remainingThreshold = Math.max(0, remainingThreshold - creditSpent);

      const debitToDeduct = Math.max(0, debitSpent - remainingThreshold);
      remainingThreshold = Math.max(0, remainingThreshold - debitSpent);

      const transitMarketToDeduct = Math.max(0, transitMarketSpent - remainingThreshold);

      cardDeductionAmount = Math.floor((creditToDeduct * 0.15) + (debitToDeduct * 0.30) + (transitMarketToDeduct * 0.40));
    }

    const dependents = parseOrZero(inputs.dependents);
    const personalDeduction = 1500000 + (dependents * 1500000);

    const autoInsurance = calculateAutoInsurance(totalSalary);
    const insuranceSpent = inputs.insurance ? parseOrZero(inputs.insurance) : autoInsurance;
    const insuranceDeduction = insuranceSpent;

    const housingSpent = parseOrZero(inputs.housing);
    const housingDeduction = Math.floor(Math.min(housingSpent, 3000000) * 0.4);

    const totalIncomeDeduction = personalDeduction + insuranceDeduction + housingDeduction + cardDeductionAmount;
    const taxBase = Math.max(0, earnedIncome - totalIncomeDeduction);

    // 4. 산출세액
    const calculatedTax = Math.max(0, calculateTax(taxBase));
    const taxInfo = getTaxRateInfo(taxBase);

    // 5. 세액공제
    const earnedIncomeTaxCreditInfo = calculateEarnedIncomeTaxCredit(calculatedTax, totalSalary);
    const earnedIncomeTaxCredit = earnedIncomeTaxCreditInfo.finalCredit;

    const donationSpent = parseOrZero(inputs.donation);
    const rentSpent = parseOrZero(inputs.monthlyRent);
    const otherSpent = parseOrZero(inputs.otherExpenses);

    const donationCredit = Math.floor(donationSpent * 0.15);
    const rentCredit = Math.floor(Math.min(rentSpent, 7500000) * 0.15);
    const otherCredit = Math.floor(otherSpent * 0.15);

    let smeCredit = 0;
    if (isSmeEmployee) {
      smeCredit = Math.floor(Math.min(calculatedTax * 0.90, 2000000));
    }

    const totalTaxCredits = earnedIncomeTaxCredit + donationCredit + rentCredit + otherCredit + smeCredit;
    const finalTax = Math.max(0, calculatedTax - totalTaxCredits);

    // 환급/납부액
    const prepaidTax = parseOrZero(inputs.prepaidTax);
    const refundOrPay = finalTax - prepaidTax;

    return {
      totalSalary,
      autoInsurance,
      earnedIncomeDeduction,
      earnedIncome,
      threshold,
      totalCardSpend,
      cardDeductionAmount,
      dependents,
      personalDeduction,
      insuranceSpent,
      insuranceDeduction,
      housingSpent,
      housingDeduction,
      totalIncomeDeduction,
      taxBase,
      calculatedTax,
      taxInfo,
      earnedIncomeTaxCreditInfo,
      earnedIncomeTaxCredit,
      donationSpent,
      donationCredit,
      rentSpent,
      rentCredit,
      otherSpent,
      otherCredit,
      smeCredit,
      totalTaxCredits,
      finalTax,
      prepaidTax,
      refundOrPay
    };
  }, [inputs, isSmeEmployee]);

  const togglePhase = (phase: number) => {
    setExpandedPhase(expandedPhase === phase ? null : phase);
  };

  return (
    <div className="relative min-h-screen bg-wave-pattern pb-32">
      <div className="gradient-blob bg-theme-400 w-[600px] h-[600px] rounded-full top-[-100px] left-[-200px]" />
      <div className="gradient-blob bg-accent-500 w-[500px] h-[500px] rounded-full top-[20%] right-[-100px] opacity-20" />
      <div className="gradient-blob bg-blue-300 w-[700px] h-[700px] rounded-full bottom-[-200px] left-[10%] opacity-30" />

      <div className="relative z-10 w-full flex justify-center pt-20 pb-16">
        <div className="bg-white rounded-[3rem] shadow-float px-12 py-10 w-full max-w-5xl mx-6 flex flex-col md:flex-row items-center justify-between border border-white">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-theme-100 flex items-center justify-center shadow-inner">
              <Calculator className="w-10 h-10 text-theme-600" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-theme-900 tracking-tight mb-2">간편 연말정산</h1>
              <p className="text-slate-500 font-medium">실제 사용 금액을 입력하시면 공제액과 세금을 자동으로 계산해드려요.</p>
            </div>
          </div>
          <div className="mt-8 md:mt-0 ml-0 md:ml-8 flex-shrink-0">
            <div className="bg-theme-50 px-6 py-4 rounded-3xl text-theme-800 font-bold border border-theme-100 flex items-center">
              <Building2 className="w-5 h-5 mr-3 text-theme-600" />
              <label className="flex items-center cursor-pointer">
                <input type="checkbox" className="w-5 h-5 mr-2 accent-theme-600" checked={isSmeEmployee} onChange={(e) => setIsSmeEmployee(e.target.checked)} />
                <span>중소기업 취업자 감면 적용</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <main className="relative z-10 max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <InputSection inputs={inputs} handleInputChange={handleInputChange} autoInsurance={result.autoInsurance} />
        <ResultSection result={result} isSmeEmployee={isSmeEmployee} expandedPhase={expandedPhase} togglePhase={togglePhase} />
      </main>
    </div>
  );
}
