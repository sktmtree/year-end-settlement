import { Info, ChevronUp, ChevronDown, CheckCircle, Gift } from 'lucide-react';
import type { TaxResult } from '../types';

interface ResultSectionProps {
    result: TaxResult;
    isSmeEmployee: boolean;
    expandedPhase: number | null;
    togglePhase: (phase: number) => void;
}

export default function ResultSection({ result, isSmeEmployee, expandedPhase, togglePhase }: ResultSectionProps) {
    return (
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
                                        <li><strong>인적공제:</strong> 본인 및 부양가족 {result.dependents + 1}명, 총 {result.personalDeduction.toLocaleString()}원 공제</li>
                                        <li><strong>4대보험료:</strong> 납부액 {result.insuranceSpent.toLocaleString()}원 → <strong className="text-theme-600">전액({result.insuranceDeduction.toLocaleString()}원) 공제</strong></li>
                                        <li><strong>주택청약:</strong> 납입액 {result.housingSpent.toLocaleString()}원 (한도 300만) → <strong className="text-theme-600">40%({result.housingDeduction.toLocaleString()}원) 공제</strong></li>
                                        <li><strong>카드 등 소비:</strong> 지출 {result.totalCardSpend.toLocaleString()}원 → <strong className="text-theme-600">{result.cardDeductionAmount.toLocaleString()}원 공제</strong></li>
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
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-slate-700">기부금 공제 (약 15% 반영)</span>
                                                <span className="text-[10px] text-slate-500">지출액: {result.donationSpent.toLocaleString()}원</span>
                                            </div>
                                            <span className="text-accent-600">{result.donationCredit.toLocaleString()}원</span>
                                        </li>

                                        <li className="flex justify-between items-center bg-slate-50 p-2 rounded">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-slate-700">월세액 공제 (약 15% 반영)</span>
                                                <span className="text-[10px] text-slate-500">지출액: {result.rentSpent.toLocaleString()}원 (한도 750만)</span>
                                            </div>
                                            <span className="text-accent-600">{result.rentCredit.toLocaleString()}원</span>
                                        </li>

                                        <li className="flex justify-between items-center bg-slate-50 p-2 rounded">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-slate-700">기타 공제 (의료비 등, 약 15% 반영)</span>
                                                <span className="text-[10px] text-slate-500">지출액: {result.otherSpent.toLocaleString()}원</span>
                                            </div>
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
    );
}
