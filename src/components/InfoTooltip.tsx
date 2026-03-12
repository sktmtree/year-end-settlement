import React, { useState, useEffect, useRef } from 'react';
import { Info, X } from 'lucide-react';

export default function InfoTooltip({ text }: { text: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const tooltipRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="relative items-center ml-1 z-[60]" ref={tooltipRef} style={{ display: 'inline-block', verticalAlign: 'middle', height: 16 }}>
            <button
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsOpen(!isOpen); }}
                className="text-slate-400 hover:text-theme-500 transition-colors cursor-pointer outline-none flex items-center justify-center -translate-y-[2px]"
            >
                <Info className="w-4 h-4" />
            </button>

            {isOpen && (
                <div className="absolute left-[50%] -translate-x-[50%] sm:left-0 sm:translate-x-0 top-full mt-2 w-[260px] max-w-[85vw] bg-slate-800 text-white text-xs rounded-xl p-3 shadow-xl break-keep">
                    <div className="absolute -top-1.5 left-[50%] -translate-x-[50%] sm:left-2 sm:translate-x-0 w-3 h-3 bg-slate-800 rotate-45"></div>
                    <div className="flex justify-between items-start mb-1 border-b border-slate-700 pb-1">
                        <span className="font-bold text-slate-200">상세 안내</span>
                        <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsOpen(false); }} className="text-slate-400 hover:text-white"><X className="w-3 h-3" /></button>
                    </div>
                    <div className="leading-relaxed whitespace-pre-line text-slate-300 mt-2 font-normal">
                        {text}
                    </div>
                </div>
            )}
        </div>
    );
}
