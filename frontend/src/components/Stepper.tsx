'use client';

import React from 'react';
import { Check, Calendar, ClipboardList, Sliders, Send } from 'lucide-react';

interface StepperProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

const STEPS = [
  { id: 1, title: 'Event Basics', description: 'Date, location & category', icon: Calendar },
  { id: 2, title: 'Role Scope', description: 'Category specific questions', icon: ClipboardList },
  { id: 3, title: 'Logistics & Budget', description: 'Rates, gear & shift times', icon: Sliders },
  { id: 4, title: 'Review & Submit', description: 'Verify & save to database', icon: Send }
];

export const Stepper: React.FC<StepperProps> = ({ currentStep, onStepClick }) => {
  return (
    <div className="w-full mb-8 font-serif">
      {/* Mobile Step Header */}
      <div className="flex md:hidden items-center justify-between bg-white border border-emerald-200 rounded-2xl p-4 mb-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-semibold text-sm shadow">
            {currentStep}
          </div>
          <div>
            <p className="text-xs text-emerald-700 font-medium">Step {currentStep} of 4</p>
            <h3 className="text-sm font-bold text-emerald-950">{STEPS[currentStep - 1].title}</h3>
          </div>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
          {Math.round((currentStep / 4) * 100)}%
        </span>
      </div>

      {/* Desktop Stepper */}
      <div className="hidden md:flex items-center justify-between relative px-6">
        {/* Connecting Progress Bar */}
        <div className="absolute left-16 right-16 top-6 h-1 bg-emerald-100 -z-0 rounded-full">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all duration-500"
            style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
          />
        </div>

        {STEPS.map((step) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const StepIcon = step.icon;

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => isCompleted && onStepClick(step.id)}
              disabled={!isCompleted && !isCurrent}
              className={`flex flex-col items-center group relative z-10 focus:outline-none transition-all ${
                isCompleted ? 'cursor-pointer' : isCurrent ? 'cursor-default' : 'cursor-not-allowed'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  isCompleted
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-200'
                    : isCurrent
                    ? 'bg-white text-emerald-700 border-2 border-emerald-600 shadow-lg ring-4 ring-emerald-100 scale-110'
                    : 'bg-white border-2 border-emerald-200 text-emerald-500 group-hover:border-emerald-300'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5 stroke-[3]" />
                ) : (
                  <StepIcon className={`w-5 h-5 ${isCurrent ? 'text-emerald-700' : 'text-emerald-500'}`} />
                )}
              </div>

              <div className="mt-2.5 text-center">
                <p
                  className={`text-xs tracking-wide transition-colors ${
                    isCurrent ? 'text-emerald-950 font-extrabold' : isCompleted ? 'text-emerald-800 font-bold' : 'text-slate-600 font-semibold'
                  }`}
                >
                  {step.title}
                </p>
                <p className={`text-[11px] mt-0.5 hidden lg:block ${isCurrent ? 'text-emerald-700 font-medium' : isCompleted ? 'text-emerald-600' : 'text-slate-500 font-normal'}`}>
                  {step.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
