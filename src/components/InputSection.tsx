import React from 'react';
import { CreditCard, HeartPulse, UserCircle, BriefcaseMedical, Home, Train, Store, Wallet, Receipt, Gift } from 'lucide-react';
import InfoTooltip from './InfoTooltip';
import type { TaxInputs } from '../types';

interface InputSectionProps {
    inputs: TaxInputs;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    autoInsurance: number;
}

export default function InputSection({ inputs, handleInputChange, autoInsurance }: InputSectionProps) {
    return (
        <section className="col-span-1 lg:col-span-5 space-y-8">
            {/* 1. 기본 소득 정보 */}
            <div className="bg-white rounded-5xl shadow-soft p-10 relative group hover:shadow-float transition-all duration-500 border border-white">
                <h2 className="text-2xl font-bold text-theme-900 mb-8 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-theme-600 flex items-center justify-center text-white shadow-md">1</div>
                    기본 소득 정보
                </h2>

                <div className="space-y-6">
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 focus-within:border-theme-300 focus-within:ring-2 focus-within:ring-theme-100 transition-all overflow-visible">
                        <label className="block text-sm font-bold text-theme-700 mb-3 ml-1 flex items-center relative z-[60]">
                            총 연봉 (원, 비과세 포함) <InfoTooltip text={`모든 급여(과세+비과세)의 총합을 말합니다.\n근로계약서상의 연봉(세전)을 기준으로 적으시면 됩니다.`} />
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
                                비과세 식비 등 <InfoTooltip text={`식대(월 20만원 한도), 자가운전보조금(월 20만원), 육아수당(월 20만원) 등 소득세가 처음부터 부과되지 않는 세금 청정 구역 금액입니다.\n1년치 총합을 적어주세요.`} />
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
                            <label className="block text-xs font-bold text-theme-600 mb-2 ml-1 flex items-center relative z-50">
                                기납부세액 <InfoTooltip text={`매달 월급 명세서에서 떼어갔던 '소득세'의 1년 치 합산액입니다.\n이 금액을 기준으로 최종 결정세액과 비교하여 토해낼지, 돌려받을지 결정됩니다. (지방소득세 제외)`} />
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

            {/* 2. 소득공제 내역 */}
            <div className="bg-white rounded-5xl shadow-soft p-10 border border-white hover:shadow-float transition-all duration-500 relative">
                <h2 className="text-2xl font-bold text-theme-900 mb-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white shadow-md">2</div>
                    소득공제 내역
                </h2>
                <p className="text-xs text-slate-500 mb-6 px-1">실제 지출한 금액을 입력하면 공제액이 자동 산출됩니다.</p>

                <div className="space-y-3">
                    <div className="flex items-center gap-4 p-3 rounded-2xl bg-theme-50/50 hover:bg-theme-50 transition-colors border border-transparent hover:border-theme-100 relative z-[45]">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                            <UserCircle className="w-5 h-5 text-theme-500" />
                        </div>
                        <div className="flex-grow">
                            <label className="block text-xs font-bold text-slate-500 mb-1 flex items-center">
                                추가 부양가족 수 (명) <InfoTooltip text={`본인 기본공제(150만 원)는 자동으로 계산되므로 본인 이외의 부양가족 수만 적어주세요!\n(부양가족 1명당 150만 원 공제가 가산됩니다)`} />
                            </label>
                            <div className="relative flex items-center">
                                <input type="text" name="dependents" value={inputs.dependents} onChange={handleInputChange} placeholder="예: 2" className="w-full bg-transparent text-md font-bold text-theme-900 placeholder:text-slate-300 outline-none pr-8" />
                                <span className="text-xs font-bold text-slate-400 absolute right-3">명</span>
                            </div>
                        </div>            </div>

                    <div className="flex items-center gap-4 p-3 rounded-2xl bg-theme-50/50 hover:bg-theme-50 transition-colors border border-transparent hover:border-theme-100 relative z-[40]">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                            <HeartPulse className="w-5 h-5 text-green-500" />
                        </div>
                        <div className="flex-grow">
                            <label className="block text-xs font-bold text-slate-500 mb-1 flex items-center">납부한 4대보험 등 <InfoTooltip text={`올해 월급에서 떼어간 국민연금(4.75%), 건강보험(3.595%), 장기요양보험(건보료의 13.14%), 고용보험(0.9%)의 합산액입니다.\n기본적으로 총급여액을 기준으로 자동 산출된 금액이 예상 적용됩니다.\n실제 납부액과 다르다면 직접 수정해 주세요 (산재보험 제외).`} /></label>
                            <input type="text" name="insurance" value={inputs.insurance ? Number(inputs.insurance).toLocaleString() : ''} onChange={handleInputChange} placeholder={autoInsurance > 0 ? `예상액: ${autoInsurance.toLocaleString()}원` : ''} className="w-full bg-transparent text-md font-bold text-theme-900 placeholder:text-theme-400 outline-none" />
                            {!inputs.insurance && autoInsurance > 0 && (
                                <span className="text-[10px] text-theme-500 font-bold mt-1 inline-block bg-theme-100 px-2 py-0.5 rounded-full">자동 계산 적용 중</span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-3 rounded-2xl bg-theme-50/50 hover:bg-theme-50 transition-colors border border-transparent hover:border-theme-100 relative z-[35]">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                            <Home className="w-5 h-5 text-blue-500" />
                        </div>
                        <div className="flex-grow">
                            <label className="block text-xs font-bold text-slate-500 mb-1 flex items-center">주택청약 납입액 <InfoTooltip text={`무주택 세대주이며 총급여 7천만 원 이하인 경우에만 혜택을 받습니다.\n1년간 넣은 청약통장 납입액(연 300만 원 한도)을 입력해주시면 40%가 자동 공제됩니다.`} /></label>
                            <input type="text" name="housing" value={inputs.housing ? Number(inputs.housing).toLocaleString() : ''} onChange={handleInputChange} className="w-full bg-transparent text-md font-bold text-theme-900 placeholder:text-slate-300 outline-none" />
                        </div>
                    </div>

                    {/* Card / Cash Section */}
                    <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-3 relative z-[30]">
                        <div className="col-span-2">
                            <p className="text-xs font-bold text-theme-600 px-1 mb-1">신용카드 등 소비금액 (총 지출액 입력)</p>
                        </div>
                        <div className="bg-theme-50/50 p-3 rounded-2xl border border-transparent focus-within:border-theme-300 relative z-[28]">
                            <label className="block text-xs font-bold text-slate-500 mb-1 flex items-center gap-1"><CreditCard className="w-3 h-3" /> 신용카드 <InfoTooltip text="올해 긁은 신용카드 총액을 적어주세요! (공제율 15%)" /></label>
                            <input type="text" name="creditCard" value={inputs.creditCard ? Number(inputs.creditCard).toLocaleString() : ''} onChange={handleInputChange} className="w-full bg-transparent text-sm font-bold text-theme-900 outline-none" />
                        </div>
                        <div className="bg-theme-50/50 p-3 rounded-2xl border border-transparent focus-within:border-theme-300 relative z-[26]">
                            <label className="block text-xs font-bold text-slate-500 mb-1 flex items-center gap-1"><Wallet className="w-3 h-3" /> 체크카드 <InfoTooltip text="올해 쓴 체크카드 총액입니다. (공제율 30%)" /></label>
                            <input type="text" name="debitCard" value={inputs.debitCard ? Number(inputs.debitCard).toLocaleString() : ''} onChange={handleInputChange} className="w-full bg-transparent text-sm font-bold text-theme-900 outline-none" />
                        </div>
                        <div className="bg-theme-50/50 p-3 rounded-2xl border border-transparent focus-within:border-theme-300 relative z-[24]">
                            <label className="block text-xs font-bold text-slate-500 mb-1 flex items-center gap-1"><Receipt className="w-3 h-3" /> 현금영수증 <InfoTooltip text="휴대폰 번호 등으로 발급받은 현금영수증 총액입니다. (공제율 30%)" /></label>
                            <input type="text" name="cashReceipt" value={inputs.cashReceipt ? Number(inputs.cashReceipt).toLocaleString() : ''} onChange={handleInputChange} className="w-full bg-transparent text-sm font-bold text-theme-900 outline-none" />
                        </div>
                        <div className="bg-theme-50/50 p-3 rounded-2xl border border-transparent focus-within:border-theme-300 relative z-[22]">
                            <label className="block text-xs font-bold text-slate-500 mb-1 flex items-center gap-1"><Train className="w-3 h-3" /> 대중교통 <InfoTooltip text="버스, 지하철, KTX 등에 결제한 총액입니다. (공제율 40%, 택시/항공기 제외)" /></label>
                            <input type="text" name="publicTransport" value={inputs.publicTransport ? Number(inputs.publicTransport).toLocaleString() : ''} onChange={handleInputChange} className="w-full bg-transparent text-sm font-bold text-theme-900 outline-none" />
                        </div>
                        <div className="bg-theme-50/50 p-3 rounded-2xl border border-transparent focus-within:border-theme-300 col-span-2 relative z-[20]">
                            <label className="block text-xs font-bold text-slate-500 mb-1 flex items-center gap-1"><Store className="w-3 h-3" /> 전통시장/도서 등 <InfoTooltip text="전통시장 사용 금액, 그리고 총급여 7천만 원 이하의 경우 도서, 공연, 미술관, 박물관, 영화관 결제금액도 여기에 합산하세요! (공제율 40%)" /></label>
                            <input type="text" name="traditionalMarket" value={inputs.traditionalMarket ? Number(inputs.traditionalMarket).toLocaleString() : ''} onChange={handleInputChange} className="w-full bg-transparent text-sm font-bold text-theme-900 outline-none" />
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. 세액공제 내역 */}
            <div className="bg-white rounded-5xl shadow-soft p-10 border border-white hover:shadow-float transition-all duration-500 relative">
                <h2 className="text-2xl font-bold text-theme-900 mb-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-accent-500 flex items-center justify-center text-white shadow-md">3</div>
                    세액공제 내역
                </h2>
                <p className="text-xs text-slate-500 mb-6 px-1">의료비, 교육비, 기부금 등 실제 낸 금액을 적어주세요.</p>
                <div className="space-y-3">
                    <div className="flex items-center gap-4 p-3 rounded-2xl bg-accent-50/50 border border-transparent hover:border-accent-200 transition-colors relative z-[15]">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                            <Gift className="w-5 h-5 text-accent-500" />
                        </div>
                        <div className="flex-grow">
                            <label className="block text-xs font-bold text-slate-500 mb-1 flex items-center">기부금 지출액 <InfoTooltip text={`법정기부금(수재의연금 등)이나 자선/종교/학술 등 각 지정기부금에 올해 직접 내신 금액 총액을 입력하세요.`} /></label>
                            <input type="text" name="donation" value={inputs.donation ? Number(inputs.donation).toLocaleString() : ''} onChange={handleInputChange} className="w-full bg-transparent text-md font-bold text-theme-900 placeholder:text-slate-300 outline-none" />
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-3 rounded-2xl bg-accent-50/50 border border-transparent hover:border-accent-200 transition-colors relative z-[10]">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                            <Home className="w-5 h-5 text-accent-500" />
                        </div>
                        <div className="flex-grow">
                            <label className="block text-xs font-bold text-slate-500 mb-1 flex items-center">월세 납입액 (1년치) <InfoTooltip text={`무주택 세대주이며 총급여 7천만 원 이하의 요건을 만족하는 경우, 1년 동안 내신 월세 총액(연 750만 원 한도)을 넣으세요.\n이 계산기에선 약 15% 감면되도록 로직이 반영되어 있습니다.`} /></label>
                            <input type="text" name="monthlyRent" value={inputs.monthlyRent ? Number(inputs.monthlyRent).toLocaleString() : ''} onChange={handleInputChange} className="w-full bg-transparent text-md font-bold text-theme-900 placeholder:text-slate-300 outline-none" />
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-3 rounded-2xl bg-accent-50/50 border border-transparent hover:border-accent-200 transition-colors relative z-[5]">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                            <BriefcaseMedical className="w-5 h-5 text-accent-500" />
                        </div>
                        <div className="flex-grow">
                            <label className="block text-xs font-bold text-slate-500 mb-1 flex items-center">기타 (의료비, 교육비 등 지출) <InfoTooltip text={`의료비(총급여액의 3% 초과 지출분), 본인 및 부양가족의 교육비, 보장성 보험료 등 그 외에 지출하신 굵직한 세액공제용 실지출액을 합산해 넣어주세요.`} /></label>
                            <input type="text" name="otherExpenses" value={inputs.otherExpenses ? Number(inputs.otherExpenses).toLocaleString() : ''} onChange={handleInputChange} className="w-full bg-transparent text-md font-bold text-theme-900 placeholder:text-slate-300 outline-none" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
