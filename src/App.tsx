import React, { useState, useMemo } from 'react';
import { Calculator, Info, ChevronUp, ChevronDown, CheckCircle, CreditCard, HeartPulse, UserCircle, BriefcaseMedical, Home, Train, Store, Wallet, Receipt, Gift, Building2 } from 'lucide-react';

function calculateEarnedIncomeDeduction(totalSalary: number) {
  if (totalSalary <= 5000000) return totalSalary * 0.7;
  if (totalSalary <= 15000000) return 3500000 + (totalSalary - 5000000) * 0.4;
  if (totalSalary <= 45000000) return 7500000 + (totalSalary - 15000000) * 0.15;
  if (totalSalary <= 100000000) return 12000000 + (totalSalary - 45000000) * 0.05;
  return 14750000 + (totalSalary - 100000000) * 0.02;
}

function getTaxRateInfo(taxBase: number) {
  if (taxBase <= 14000000) return { rate: 6, deduction: 0 };
  if (taxBase <= 50000000) return { rate: 15, deduction: 1260000 };
  if (taxBase <= 88000000) return { rate: 24, deduction: 5760000 };
  if (taxBase <= 150000000) return { rate: 35, deduction: 15440000 };
  if (taxBase <= 300000000) return { rate: 38, deduction: 19940000 };
  if (taxBase <= 500000000) return { rate: 40, deduction: 25940000 };
  if (taxBase <= 1000000000) return { rate: 42, deduction: 35940000 };
  return { rate: 45, deduction: 65940000 };
}

function calculateTax(taxBase: number) {
  const info = getTaxRateInfo(taxBase);
  return taxBase * (info.rate / 100) - info.deduction;
}

function calculateEarnedIncomeTaxCredit(calculatedTax: number, totalSalary: number) {
  let baseCredit = calculatedTax <= 1300000
    ? calculatedTax * 0.55
    : 715000 + (calculatedTax - 1300000) * 0.3;

  let limit = 740000;
  if (totalSalary <= 33000000) {
    limit = 740000;
  } else if (totalSalary <= 70000000) {
    limit = Math.max(660000, 740000 - (totalSalary - 33000000) * 0.008);
  } else {
    limit = Math.max(500000, 660000 - (totalSalary - 70000000) * 0.5);
  }

  return {
    baseCredit,
    limit,
    finalCredit: Math.min(baseCredit, limit)
  };
}

function App() {
  const [inputs, setInputs] = useState({
    salary: '',
    nonTaxable: '',
    personalDeduction: '1500000',
    insurance: '',
    housing: '',
    // 소비금액 입력
    creditCard: '',
    debitCard: '',
    cashReceipt: '',
    publicTransport: '',
    traditionalMarket: '',
    // 세액공제(지출액) 입력
    donation: '',
    monthlyRent: '',
    otherExpenses: '', // 의료비, 교육비 등
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

      // 최저공제율(신용카드 15%)부터 문턱(최저사용금액)을 채움 (유리한 계산 방식)
      const creditToDeduct = Math.max(0, creditSpent - remainingThreshold);
      remainingThreshold = Math.max(0, remainingThreshold - creditSpent);

      const debitToDeduct = Math.max(0, debitSpent - remainingThreshold);
      remainingThreshold = Math.max(0, remainingThreshold - debitSpent);

      const transitMarketToDeduct = Math.max(0, transitMarketSpent - remainingThreshold);

      cardDeductionAmount = (creditToDeduct * 0.15) + (debitToDeduct * 0.30) + (transitMarketToDeduct * 0.40);
      // 한도 계산(기본 300만)은 생략된 추정 계산
    }

    const personalDeduction = parseOrZero(inputs.personalDeduction);
    const insurance = parseOrZero(inputs.insurance);
    const housing = parseOrZero(inputs.housing);

    const totalIncomeDeduction = personalDeduction + insurance + housing + cardDeductionAmount;
    const taxBase = Math.max(0, earnedIncome - totalIncomeDeduction);

    // 4. 산출세액
    const calculatedTax = Math.max(0, calculateTax(taxBase));
    const taxInfo = getTaxRateInfo(taxBase);

    // 5. 세액공제
    const earnedIncomeTaxCreditInfo = calculateEarnedIncomeTaxCredit(calculatedTax, totalSalary);
    const earnedIncomeTaxCredit = earnedIncomeTaxCreditInfo.finalCredit;

    // 사용자가 입력한 지출액에 따른 단순 세액공제액 산출 (예: 15% 일괄 가정)
    const donationSpent = parseOrZero(inputs.donation);
    const rentSpent = parseOrZero(inputs.monthlyRent);
    const otherSpent = parseOrZero(inputs.otherExpenses);

    const donationCredit = donationSpent * 0.15; // 법정/지정기부금 등 복잡한 요건 단순화(15%)
    const rentCredit = rentSpent * 0.15; // 월세 15~17% (단순화)
    const otherCredit = otherSpent * 0.15; // 의료비, 교육비 등 (보통 15%)

    let smeCredit = 0;
    if (isSmeEmployee) {
      smeCredit = Math.min(calculatedTax * 0.90, 2000000); // 90% 감면, 한도 200만원
    }

    const totalTaxCredits = earnedIncomeTaxCredit + donationCredit + rentCredit + otherCredit + smeCredit;
    const finalTax = Math.max(0, calculatedTax - totalTaxCredits);

    // 환급/납부액
    const prepaidTax = parseOrZero(inputs.prepaidTax);
    const refundOrPay = finalTax - prepaidTax;

    return {
      totalSalary,
      earnedIncomeDeduction,
      earnedIncome,
      threshold,
      totalCardSpend,
      cardDeductionAmount,
      personalDeduction,
      insurance,
      housing,
      totalIncomeDeduction,
      taxBase,
      calculatedTax,
      taxInfo,
      earnedIncomeTaxCreditInfo,
      earnedIncomeTaxCredit,
      donationCredit,
      rentCredit,
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
      {/* Decorative Blobs */}
      <div className="gradient-blob bg-theme-400 w-[600px] h-[600px] rounded-full top-[-100px] left-[-200px]" />
      <div className="gradient-blob bg-accent-500 w-[500px] h-[500px] rounded-full top-[20%] right-[-100px] opacity-20" />
      <div className="gradient-blob bg-blue-300 w-[700px] h-[700px] rounded-full bottom-[-200px] left-[10%] opacity-30" />

      {/* Header Container */}
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

        {/* Left Column: Input Panel */}
        <section className="col-span-1 lg:col-span-5 space-y-8">

          <div className="bg-white rounded-5xl shadow-soft p-10 relative overflow-hidden group hover:shadow-float transition-all duration-500 border border-white">
            <h2 className="text-2xl font-bold text-theme-900 mb-8 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-theme-600 flex items-center justify-center text-white shadow-md">1</div>
              기본 소득 정보
            </h2>

            <div className="space-y-6">
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 focus-within:border-theme-300 focus-within:ring-2 focus-within:ring-theme-100 transition-all">
                <label className="block text-sm font-bold text-theme-700 mb-3 ml-1">
                  총 연봉 (원, 비과세 포함)
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    name="salary"
                    value={inputs.salary ? Number(inputs.salary).toLocaleString() : ''}
                    onChange={handleInputChange}
                    placeholder="예: 30,000,000"
                    className="w-full bg-transparent text-2xl font-bold text-theme-900 placeholder:text-slate-300 outline-none"
                  />
                  <span className="text-lg font-bold text-slate-400">원</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100 focus-within:border-theme-300 transition-all">
                  <label className="block text-xs font-bold text-theme-600 mb-2 ml-1 flex items-center">
                    비과세 식비 등 <Info className="w-3 h-3 ml-1 text-slate-400" />
                  </label>
                  <input
                    type="text"
                    name="nonTaxable"
                    value={inputs.nonTaxable ? Number(inputs.nonTaxable).toLocaleString() : ''}
                    onChange={handleInputChange}
                    className="w-full bg-transparent text-lg font-bold text-theme-900 placeholder:text-slate-300 outline-none"
                  />
                </div>
                <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100 focus-within:border-theme-300 transition-all">
                  <label className="block text-xs font-bold text-theme-600 mb-2 ml-1 flex items-center">
                    기납부세액 <Info className="w-3 h-3 ml-1 text-slate-400" />
                  </label>
                  <input
                    type="text"
                    name="prepaidTax"
                    value={inputs.prepaidTax ? Number(inputs.prepaidTax).toLocaleString() : ''}
                    onChange={handleInputChange}
                    className="w-full bg-transparent text-lg font-bold text-theme-900 placeholder:text-slate-300 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-5xl shadow-soft p-10 border border-white hover:shadow-float transition-all duration-500">
            <h2 className="text-2xl font-bold text-theme-900 mb-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white shadow-md">2</div>
              소득공제 내역
            </h2>
            <p className="text-xs text-slate-500 mb-6 px-1">실제 지출한 금액을 입력하면 공제액이 자동 산출됩니다.</p>

            <div className="space-y-3">
              <div className="flex items-center gap-4 p-3 rounded-2xl bg-theme-50/50 hover:bg-theme-50 transition-colors border border-transparent hover:border-theme-100">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                  <UserCircle className="w-5 h-5 text-theme-500" />
                </div>
                <div className="flex-grow">
                  <label className="block text-xs font-bold text-slate-500 mb-1">인적공제 (자동 반영 외 추가액)</label>
                  <input type="text" name="personalDeduction" value={inputs.personalDeduction ? Number(inputs.personalDeduction).toLocaleString() : ''} onChange={handleInputChange} className="w-full bg-transparent text-md font-bold text-theme-900 placeholder:text-slate-300 outline-none" />
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 rounded-2xl bg-theme-50/50 hover:bg-theme-50 transition-colors border border-transparent hover:border-theme-100">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                  <HeartPulse className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex-grow">
                  <label className="block text-xs font-bold text-slate-500 mb-1">납부한 4대보험 등</label>
                  <input type="text" name="insurance" value={inputs.insurance ? Number(inputs.insurance).toLocaleString() : ''} onChange={handleInputChange} className="w-full bg-transparent text-md font-bold text-theme-900 placeholder:text-slate-300 outline-none" />
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 rounded-2xl bg-theme-50/50 hover:bg-theme-50 transition-colors border border-transparent hover:border-theme-100">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                  <Home className="w-5 h-5 text-blue-500" />
                </div>
                <div className="flex-grow">
                  <label className="block text-xs font-bold text-slate-500 mb-1">주택청약 납입액</label>
                  <input type="text" name="housing" value={inputs.housing ? Number(inputs.housing).toLocaleString() : ''} onChange={handleInputChange} className="w-full bg-transparent text-md font-bold text-theme-900 placeholder:text-slate-300 outline-none" />
                </div>
              </div>

              {/* Card / Cash Section */}
              <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <p className="text-xs font-bold text-theme-600 px-1 mb-1">신용카드 등 소비금액 (총 지출액 입력)</p>
                </div>
                <div className="bg-theme-50/50 p-3 rounded-2xl border border-transparent focus-within:border-theme-300">
                  <label className="block text-xs font-bold text-slate-500 mb-1 flex items-center gap-1"><CreditCard className="w-3 h-3" /> 신용카드</label>
                  <input type="text" name="creditCard" value={inputs.creditCard ? Number(inputs.creditCard).toLocaleString() : ''} onChange={handleInputChange} className="w-full bg-transparent text-sm font-bold text-theme-900 outline-none" />
                </div>
                <div className="bg-theme-50/50 p-3 rounded-2xl border border-transparent focus-within:border-theme-300">
                  <label className="block text-xs font-bold text-slate-500 mb-1 flex items-center gap-1"><Wallet className="w-3 h-3" /> 체크카드</label>
                  <input type="text" name="debitCard" value={inputs.debitCard ? Number(inputs.debitCard).toLocaleString() : ''} onChange={handleInputChange} className="w-full bg-transparent text-sm font-bold text-theme-900 outline-none" />
                </div>
                <div className="bg-theme-50/50 p-3 rounded-2xl border border-transparent focus-within:border-theme-300">
                  <label className="block text-xs font-bold text-slate-500 mb-1 flex items-center gap-1"><Receipt className="w-3 h-3" /> 현금영수증</label>
                  <input type="text" name="cashReceipt" value={inputs.cashReceipt ? Number(inputs.cashReceipt).toLocaleString() : ''} onChange={handleInputChange} className="w-full bg-transparent text-sm font-bold text-theme-900 outline-none" />
                </div>
                <div className="bg-theme-50/50 p-3 rounded-2xl border border-transparent focus-within:border-theme-300">
                  <label className="block text-xs font-bold text-slate-500 mb-1 flex items-center gap-1"><Train className="w-3 h-3" /> 대중교통</label>
                  <input type="text" name="publicTransport" value={inputs.publicTransport ? Number(inputs.publicTransport).toLocaleString() : ''} onChange={handleInputChange} className="w-full bg-transparent text-sm font-bold text-theme-900 outline-none" />
                </div>
                <div className="bg-theme-50/50 p-3 rounded-2xl border border-transparent focus-within:border-theme-300 col-span-2">
                  <label className="block text-xs font-bold text-slate-500 mb-1 flex items-center gap-1"><Store className="w-3 h-3" /> 전통시장/도서/공연</label>
                  <input type="text" name="traditionalMarket" value={inputs.traditionalMarket ? Number(inputs.traditionalMarket).toLocaleString() : ''} onChange={handleInputChange} className="w-full bg-transparent text-sm font-bold text-theme-900 outline-none" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-5xl shadow-soft p-10 border border-white hover:shadow-float transition-all duration-500">
            <h2 className="text-2xl font-bold text-theme-900 mb-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-accent-500 flex items-center justify-center text-white shadow-md">3</div>
              세액공제 내역
            </h2>
            <p className="text-xs text-slate-500 mb-6 px-1">의료비, 교육비, 기부금 등 실제 낸 금액을 적어주세요.</p>
            <div className="space-y-3">
              <div className="flex items-center gap-4 p-3 rounded-2xl bg-accent-50/50 border border-transparent hover:border-accent-200 transition-colors">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                  <Gift className="w-5 h-5 text-accent-500" />
                </div>
                <div className="flex-grow">
                  <label className="block text-xs font-bold text-slate-500 mb-1">기부금 지출액</label>
                  <input type="text" name="donation" value={inputs.donation ? Number(inputs.donation).toLocaleString() : ''} onChange={handleInputChange} className="w-full bg-transparent text-md font-bold text-theme-900 placeholder:text-slate-300 outline-none" />
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 rounded-2xl bg-accent-50/50 border border-transparent hover:border-accent-200 transition-colors">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                  <Home className="w-5 h-5 text-accent-500" />
                </div>
                <div className="flex-grow">
                  <label className="block text-xs font-bold text-slate-500 mb-1">월세 납입액 (1년치)</label>
                  <input type="text" name="monthlyRent" value={inputs.monthlyRent ? Number(inputs.monthlyRent).toLocaleString() : ''} onChange={handleInputChange} className="w-full bg-transparent text-md font-bold text-theme-900 placeholder:text-slate-300 outline-none" />
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 rounded-2xl bg-accent-50/50 border border-transparent hover:border-accent-200 transition-colors">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                  <BriefcaseMedical className="w-5 h-5 text-accent-500" />
                </div>
                <div className="flex-grow">
                  <label className="block text-xs font-bold text-slate-500 mb-1">기타 (의료비, 교육비 등 지출)</label>
                  <input type="text" name="otherExpenses" value={inputs.otherExpenses ? Number(inputs.otherExpenses).toLocaleString() : ''} onChange={handleInputChange} className="w-full bg-transparent text-md font-bold text-theme-900 placeholder:text-slate-300 outline-none" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column: Dynamic Results */}
        <section className="col-span-1 lg:col-span-7 space-y-6">

          <div className="bg-theme-600 rounded-[3rem] p-10 shadow-float text-white relative overflow-hidden">
            <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <p className="text-theme-100 font-bold mb-2">예상 연말정산 결과</p>
                <div className="text-4xl md:text-5xl font-black tracking-tight flex items-center gap-2">
                  {result.refundOrPay < 0 ? '-' : ''}{Math.abs(result.refundOrPay).toLocaleString()}<span className="text-2xl font-bold text-theme-200">원</span>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/20 font-bold whitespace-nowrap">
                {result.refundOrPay < 0 ? '🎉 환급 받으실 수 있습니다' : result.refundOrPay > 0 ? '⚠️ 세금을 더 내야합니다' : '0원 입니다'}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Phase 1 */}
            <div className="bg-white rounded-4xl shadow-sm border border-slate-100/50 overflow-hidden transition-all hover:shadow-md">
              <button onClick={() => togglePhase(1)} className="w-full p-6 flex items-center justify-between bg-white hover:bg-theme-50/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${expandedPhase === 1 ? 'bg-theme-100 text-theme-600' : 'bg-slate-50 text-slate-400'}`}>1</div>
                  <span className="text-xl font-bold text-theme-900">총급여액 산출</span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-xl font-bold text-slate-700">{result.totalSalary.toLocaleString()}원</span>
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
                    {expandedPhase === 1 ? <ChevronUp className="w-5 h-5 text-theme-500" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                  </div>
                </div>
              </button>
              {expandedPhase === 1 && (
                <div className="px-6 pb-6 pt-2 bg-white">
                  <div className="p-5 rounded-3xl bg-theme-50/50 border border-theme-100/50 text-slate-600 text-sm font-medium">
                    공식: <span className="font-bold text-theme-700">연봉 - 비과세액 = 총급여액</span><br /><br />
                    연봉에서 일정한 비과세 소득을 빼면 국세청이 세금을 계산할 기초가 되는 '총급여'가 나옵니다.
                  </div>
                </div>
              )}
            </div>

            {/* Phase 2 */}
            <div className="bg-white rounded-4xl shadow-sm border border-slate-100/50 overflow-hidden transition-all hover:shadow-md">
              <button onClick={() => togglePhase(2)} className="w-full p-6 flex items-center justify-between bg-white hover:bg-theme-50/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${expandedPhase === 2 ? 'bg-theme-100 text-theme-600' : 'bg-slate-50 text-slate-400'}`}>2</div>
                  <span className="text-xl font-bold text-theme-900">근로소득금액</span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-xl font-bold text-slate-700">{result.earnedIncome.toLocaleString()}원</span>
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
                    {expandedPhase === 2 ? <ChevronUp className="w-5 h-5 text-theme-500" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                  </div>
                </div>
              </button>
              {expandedPhase === 2 && (
                <div className="px-6 pb-6 pt-2 bg-white">
                  <div className="p-5 rounded-3xl bg-theme-50/50 border border-theme-100/50 text-slate-600 text-sm font-medium">
                    공식: <span className="font-bold text-theme-700">총급여액 - 근로소득공제 = 근로소득금액</span><br /><br />
                    직장인이면 필수적으로 받는 공제, '근로소득공제'({result.earnedIncomeDeduction.toLocaleString()}원)를 빼준 금액입니다.

                    <div className="bg-white p-4 rounded-2xl border border-slate-200 mt-4 overflow-hidden">
                      <h4 className="font-bold text-theme-800 mb-2 flex items-center"><Info className="w-4 h-4 mr-1 text-theme-500" /> 근로소득공제 산출 방법 (구간별, 볼드체는 당신의 구간)</h4>
                      <ul className="list-none space-y-1 text-slate-500 text-xs mt-2">
                        <li className={`p-2 rounded ${result.totalSalary <= 5000000 ? 'bg-theme-100 font-bold text-theme-800' : ''}`}>
                          <strong>500만원 이하:</strong> 총급여액의 70%
                        </li>
                        <li className={`p-2 rounded ${result.totalSalary > 5000000 && result.totalSalary <= 15000000 ? 'bg-theme-100 font-bold text-theme-800' : ''}`}>
                          <strong>500만원 초과 1,500만원 이하:</strong> 350만원 + 500만원 초과액의 40%
                        </li>
                        <li className={`p-2 rounded ${result.totalSalary > 15000000 && result.totalSalary <= 45000000 ? 'bg-theme-100 font-bold text-theme-800' : ''}`}>
                          <strong>1,500만원 초과 4,500만원 이하:</strong> 750만원 + 1,500만원 초과액의 15%
                        </li>
                        <li className={`p-2 rounded ${result.totalSalary > 45000000 && result.totalSalary <= 100000000 ? 'bg-theme-100 font-bold text-theme-800' : ''}`}>
                          <strong>4,500만원 초과 1억원 이하:</strong> 1,200만원 + 4,500만원 초과액의 5%
                        </li>
                        <li className={`p-2 rounded ${result.totalSalary > 100000000 ? 'bg-theme-100 font-bold text-theme-800' : ''}`}>
                          <strong>1억원 초과:</strong> 1,475만원 + 1억원 초과액의 2%
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Phase 3 */}
            <div className="bg-white rounded-4xl shadow-sm border border-slate-100/50 overflow-hidden transition-all hover:shadow-md">
              <button onClick={() => togglePhase(3)} className="w-full p-6 flex items-center justify-between bg-white hover:bg-theme-50/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${expandedPhase === 3 ? 'bg-green-100 text-green-600' : 'bg-slate-50 text-slate-400'}`}>3</div>
                  <span className="text-xl font-bold text-theme-900">과세표준 산출</span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-xl font-bold text-slate-700">{result.taxBase.toLocaleString()}원</span>
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
                    {expandedPhase === 3 ? <ChevronUp className="w-5 h-5 text-theme-500" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                  </div>
                </div>
              </button>
              {expandedPhase === 3 && (
                <div className="px-6 pb-6 pt-2 bg-white">
                  <div className="p-5 rounded-3xl bg-green-50 border border-green-100/50 text-slate-600 text-sm font-medium">
                    공식: <span className="font-bold text-green-700">근로소득금액 - 각종 소득공제 = 과세표준</span><br /><br />
                    세금을 매기기 위한 진짜 기준점이 완성되었습니다.

                    <div className="bg-white p-4 rounded-2xl border border-green-100 mt-4">
                      <h4 className="font-bold text-green-800 mb-3 flex items-center">
                        방금 입력한 소비 내역의 소득공제 계산결과
                      </h4>
                      <p className="text-xs text-slate-500 mb-3">
                        신용카드 등 소비는 총급여액의 25%({result.threshold.toLocaleString()}원)를 초과해야 공제를 받습니다.<br />
                        고객님의 총 사용액은 {result.totalCardSpend.toLocaleString()}원입니다.
                      </p>
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mb-2 font-mono text-xs">
                        (총 지출액 - 문턱금액) × 결제수단별 공제율(15%~40%) = <strong>적용된 공제액 ({result.cardDeductionAmount.toLocaleString()}원)</strong>
                      </div>
                      <ul className="list-disc pl-5 space-y-1 text-slate-600 text-xs">
                        <li><strong>인적공제:</strong> {result.personalDeduction.toLocaleString()}원</li>
                        <li><strong>보험료/청약 등:</strong> {(result.insurance + result.housing).toLocaleString()}원</li>
                        <li><strong>카드 등 소득공제액:</strong> {result.cardDeductionAmount.toLocaleString()}원</li>
                      </ul>
                      <p className="text-xs text-green-700 font-bold mt-2 text-right">
                        총 소득공제액 감소: {result.totalIncomeDeduction.toLocaleString()}원 ↓
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Phase 4 */}
            <div className="bg-white rounded-4xl shadow-sm border border-slate-100/50 overflow-hidden transition-all hover:shadow-md">
              <button onClick={() => togglePhase(4)} className="w-full p-6 flex items-center justify-between bg-white hover:bg-theme-50/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${expandedPhase === 4 ? 'bg-orange-100 text-orange-600' : 'bg-slate-50 text-slate-400'}`}>4</div>
                  <span className="text-xl font-bold text-theme-900">산출세액</span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-xl font-bold text-slate-700">{result.calculatedTax.toLocaleString()}원</span>
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
                    {expandedPhase === 4 ? <ChevronUp className="w-5 h-5 text-theme-500" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                  </div>
                </div>
              </button>
              {expandedPhase === 4 && (
                <div className="px-6 pb-6 pt-2 bg-white">
                  <div className="p-5 rounded-3xl bg-orange-50 border border-orange-100/50 text-slate-600 text-sm font-medium">
                    공식: <span className="font-bold text-orange-700">과세표준 × 구간별 기본세율 - 누진공제 = 산출세액</span><br /><br />

                    <div className="bg-white p-4 rounded-2xl border border-orange-100 mt-2">
                      <p className="text-sm font-bold text-orange-800 mb-2">당신에게 적용된 세율: {result.taxInfo.rate}%</p>
                      <p className="font-mono text-xs text-slate-600 mb-4 bg-slate-50 p-2 rounded">
                        ({result.taxBase.toLocaleString()} × {result.taxInfo.rate}%) - {result.taxInfo.deduction.toLocaleString()} = {result.calculatedTax.toLocaleString()}원
                      </p>

                      <h4 className="font-bold text-slate-700 mb-2 text-xs">구간별 기본세율 가이드</h4>
                      <ul className="text-xs space-y-1 text-slate-500">
                        <li className={result.taxInfo.rate === 6 ? 'font-bold text-orange-600' : ''}>1,400만원 이하: 6%</li>
                        <li className={result.taxInfo.rate === 15 ? 'font-bold text-orange-600' : ''}>5,000만원 이하: 15% (누진공제 126만)</li>
                        <li className={result.taxInfo.rate === 24 ? 'font-bold text-orange-600' : ''}>8,800만원 이하: 24% (누진공제 576만)</li>
                        <li className={result.taxInfo.rate === 35 ? 'font-bold text-orange-600' : ''}>1.5억원 이하: 35% (누진공제 1,544만)</li>
                        <li className={result.taxInfo.rate === 38 ? 'font-bold text-orange-600' : ''}>3억원 이하: 38% (누진공제 1,994만)</li>
                        <li className={result.taxInfo.rate === 40 ? 'font-bold text-orange-600' : ''}>5억원 이하: 40% (누진공제 2,594만)</li>
                        <li className={result.taxInfo.rate > 40 ? 'font-bold text-orange-600' : ''}>최고 10억원 초과 시: 45% 적용</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Phase 5 */}
            <div className="bg-white rounded-4xl shadow-sm border border-slate-100/50 overflow-hidden transition-all hover:shadow-md">
              <button onClick={() => togglePhase(5)} className="w-full p-6 flex items-center justify-between bg-white hover:bg-theme-50/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${expandedPhase === 5 ? 'bg-accent-100 text-accent-600' : 'bg-slate-50 text-slate-400'}`}>5</div>
                  <span className="text-xl font-bold text-theme-900">최종 결정세액</span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-xl font-bold text-slate-700">{result.finalTax.toLocaleString()}원</span>
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
                    {expandedPhase === 5 ? <ChevronUp className="w-5 h-5 text-theme-500" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                  </div>
                </div>
              </button>
              {expandedPhase === 5 && (
                <div className="px-6 pb-6 pt-2 bg-white">
                  <div className="p-5 rounded-3xl bg-accent-50 border border-accent-100/50 text-slate-600 text-sm font-medium">
                    공식: <span className="font-bold text-accent-700">산출세액 - 항목별 세액공제 = 결정세액</span><br /><br />

                    <div className="bg-white p-4 rounded-2xl border border-accent-100 mt-2">
                      <h4 className="font-bold text-accent-800 mb-3 border-b border-accent-100 pb-2">반영된 세액공제 상세 내역</h4>
                      <ul className="space-y-3 text-slate-600 text-xs">

                        <li className="flex flex-col gap-1">
                          <div className="flex justify-between font-bold">
                            <span>근로소득 세액공제 (기본 적용)</span>
                            <span className="text-accent-600">{result.earnedIncomeTaxCredit.toLocaleString()}원</span>
                          </div>
                          <div className="text-slate-500 text-xs bg-white p-3 rounded-xl border border-slate-100 mt-1">
                            <p className="font-bold text-slate-700 mb-1">1. 세액공제 산출 방식 (한도 적용 전)</p>
                            <ul className="list-disc pl-4 mb-2">
                              <li>산출세액 130만 원 이하: 산출세액의 55%</li>
                              <li>산출세액 130만 원 초과: 71.5만 원 + (130만 원 초과분의 30%)</li>
                            </ul>
                            <p className="bg-slate-50 p-2 rounded mb-3 font-mono">
                              적용된 산출 공제액: {result.earnedIncomeTaxCreditInfo.baseCredit.toLocaleString()}원
                            </p>

                            <p className="font-bold text-slate-700 mb-1">2. 근로소득 세액공제 한도 (2024 귀속)</p>
                            <ul className="list-disc pl-4 mb-2">
                              <li className={result.totalSalary <= 33000000 ? "font-bold text-accent-600" : ""}>3,300만 원 이하: 74만 원</li>
                              <li className={result.totalSalary > 33000000 && result.totalSalary <= 70000000 ? "font-bold text-accent-600" : ""}>3,300만 원 초과 ~ 7천만 원 이하: 66만 원 ~ 74만 원 (급여 비례 체감)</li>
                              <li className={result.totalSalary > 70000000 ? "font-bold text-accent-600" : ""}>7,000만 원 초과: 50만 원 ~ 66만 원 (급여 비례 체감)</li>
                            </ul>
                            <p className="bg-slate-50 p-2 rounded font-mono text-xs">
                              참고: 총급여가 높을수록 한도가 줄어들며, 최저 한도는 50만 원입니다.<br />
                              <span className="text-slate-700 font-bold mt-1 inline-block">당신의 공제 한도액: {result.earnedIncomeTaxCreditInfo.limit.toLocaleString()}원</span>
                            </p>
                            <p className="text-accent-600 font-bold mt-2 text-right">
                              최종 인정 금액: min(산출액, 한도액) = {result.earnedIncomeTaxCreditInfo.finalCredit.toLocaleString()}원
                            </p>
                          </div>
                        </li>

                        {isSmeEmployee && (
                          <li className="flex flex-col gap-1 mt-2">
                            <div className="flex justify-between font-bold">
                              <span>중소기업 취업자 소득세 감면</span>
                              <span className="text-accent-600">{result.smeCredit.toLocaleString()}원</span>
                            </div>
                            <span className="text-slate-400">- 산출세액의 90% (최대 200만원 한도) 차감</span>
                          </li>
                        )}

                        <li className="flex justify-between items-center bg-slate-50 p-2 rounded">
                          <span className="font-semibold text-slate-700">기부금 공제 (지출의 약 15% 반영)</span>
                          <span className="text-accent-600">{result.donationCredit.toLocaleString()}원</span>
                        </li>

                        <li className="flex justify-between items-center bg-slate-50 p-2 rounded">
                          <span className="font-semibold text-slate-700">월세액 공제 (지출의 약 15% 반영)</span>
                          <span className="text-accent-600">{result.rentCredit.toLocaleString()}원</span>
                        </li>

                        <li className="flex justify-between items-center bg-slate-50 p-2 rounded">
                          <span className="font-semibold text-slate-700">기타 공제 (의료비 등, 약 15% 반영)</span>
                          <span className="text-accent-600">{result.otherCredit.toLocaleString()}원</span>
                        </li>
                      </ul>

                      <div className="mt-4 pt-3 border-t border-accent-100 flex justify-between font-bold text-sm text-theme-900">
                        <span>총 절약한 세금(세액공제 합산)</span>
                        <span>{result.totalTaxCredits.toLocaleString()}원</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Guide Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
            <div className="bg-white rounded-4xl p-8 shadow-soft border border-white h-full">
              <div className="w-12 h-12 bg-theme-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-theme-600" />
              </div>
              <h3 className="font-bold text-lg text-theme-900 mb-2">소득공제란?</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">
                세율을 곱하기 전 '과세표준' 금액 자체를 줄여주는 방식입니다.
              </p>
              <div className="bg-theme-50 p-4 rounded-2xl border border-theme-100 text-xs text-theme-800 leading-relaxed">
                <strong className="block mb-2 text-theme-900"><Info className="inline w-4 h-4 mr-1 text-theme-500" />주요 소득공제 및 유의사항</strong>
                신용카드(15%), 체크카드/현금영수증(30%), 대중교통/전통시장(40%) 등 결제수단별로 공제율이 다릅니다.<br /><br />
                <span className="text-red-500 font-bold">*주의:</span> 총급여의 25% 이상을 사용해야 그 초과분부터 공제를 받을 수 있으니 소비 비율을 잘 조절해보세요!
              </div>
            </div>
            <div className="bg-white rounded-4xl p-8 shadow-soft border border-white h-full">
              <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-accent-600" />
              </div>
              <h3 className="font-bold text-lg text-theme-900 mb-2">세액공제란?</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">
                계산이 끝난 산출세액에서 '세금 자체'를 직접 깎아주는 매우 효과적인 절세 방식입니다.
              </p>
              <div className="bg-accent-50 p-4 rounded-2xl border border-accent-100 text-xs text-accent-900 leading-relaxed">
                <strong className="block mb-2"><Gift className="inline w-4 h-4 mr-1 text-accent-600" />세액공제 입력 가이드</strong>
                기부금액, 월세 납입액, 병원비 등 **고객님이 실제로 지출한 총 금액**을 각 칸에 적어주세요! 이 중 통상 15% 정도가 세액공제되어 계산됩니다.
              </div>
            </div>
          </div>

        </section>

      </main>
    </div>
  );
}

export default App;
