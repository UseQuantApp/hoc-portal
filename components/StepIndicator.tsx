'use client';

import React from 'react';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

export default function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="w-full flex items-center justify-center gap-2 sm:gap-4 py-2">
      {steps.map((step, idx) => {
        const isCompleted = idx < currentStep;
        const isCurrent = idx === currentStep;

        return (
          <React.Fragment key={step}>
            <div className="flex items-center gap-2">
              <div
                className={`size-7 sm:size-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  isCompleted
                    ? 'bg-[#00b368] text-white shadow-xs'
                    : isCurrent
                    ? 'bg-[#006dff] text-white ring-4 ring-[#dbeafe]'
                    : 'bg-[#f1f5f9] text-[#94a3b8]'
                }`}
              >
                {isCompleted ? <Check size={14} /> : idx + 1}
              </div>
              <span
                className={`text-xs font-medium hidden md:inline ${
                  isCurrent ? 'font-bold text-[#006dff]' : isCompleted ? 'text-[#1e293b]' : 'text-[#94a3b8]'
                }`}
              >
                {step}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={`h-0.5 w-6 sm:w-10 rounded-full ${
                  isCompleted ? 'bg-[#00b368]' : 'bg-[#e2e8f0]'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
