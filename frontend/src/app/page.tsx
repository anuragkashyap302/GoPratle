'use client';

import React from 'react';
import { useRequirementWizard } from '@/hooks/useRequirementWizard';
import { Stepper } from '@/components/Stepper';
import { LiveSummaryCard } from '@/components/LiveSummaryCard';
import { Step1Basics } from '@/components/wizard/Step1Basics';
import { Step2CategoryScope } from '@/components/wizard/Step2CategoryScope';
import { Step3Logistics } from '@/components/wizard/Step3Logistics';
import { Step4Review } from '@/components/wizard/Step4Review';
import { ArrowLeft, ArrowRight, Layers } from 'lucide-react';

export default function RequirementPostingPage() {
  const {
    currentStep,
    formData,
    errors,
    isSubmitting,
    submitResult,
    apiError,
    updateField,
    updateCategoryDetails,
    updateAdditionalDetails,
    setCategory,
    fillSampleData,
    resetForm,
    nextStep,
    prevStep,
    goToStep,
    submitRequirement
  } = useRequirementWizard();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50/60 text-slate-800 flex flex-col justify-between font-serif">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        {/* Page Hero Header (Styled matching user screenshot 1 'Our Medical Experts') */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300 text-emerald-800 text-xs font-bold mb-3 shadow-sm">
            <Layers className="w-3.5 h-3.5 text-emerald-700" />
            <span>GoPratle Requirement Flow</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-emerald-800 to-green-700 bg-clip-text text-transparent tracking-tight">
            Post An Event Requirement
          </h1>
          <p className="text-base text-emerald-700 font-light mt-2 italic">
            Find and hire verified event planners, artists, performers, and technical crew.
          </p>
        </div>

        {/* Stepper Progress */}
        <div className="max-w-4xl mx-auto mb-6">
          <Stepper currentStep={currentStep} onStepClick={goToStep} />
        </div>

        {/* Form & Live Ticket Container */}
        <div className="flex flex-col lg:flex-row items-start gap-8 justify-center">
          {/* Main Form Card */}
          <div className="w-full lg:max-w-2xl bg-white/95 border-2 border-emerald-100 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-emerald-900/5 backdrop-blur-sm">
            {/* Step Components */}
            {currentStep === 1 && (
              <Step1Basics
                formData={formData}
                errors={errors}
                updateField={updateField}
                setCategory={setCategory}
              />
            )}

            {currentStep === 2 && (
              <Step2CategoryScope
                formData={formData}
                errors={errors}
                updateCategoryDetails={updateCategoryDetails}
              />
            )}

            {currentStep === 3 && (
              <Step3Logistics
                formData={formData}
                errors={errors}
                updateAdditionalDetails={updateAdditionalDetails}
              />
            )}

            {currentStep === 4 && (
              <Step4Review
                formData={formData}
                isSubmitting={isSubmitting}
                submitResult={submitResult}
                apiError={apiError}
                goToStep={goToStep}
                onSubmit={submitRequirement}
                onReset={resetForm}
              />
            )}

            {/* Bottom Step Navigation Bar (Steps 1 to 3) */}
            {currentStep < 4 && (
              <div className="flex items-center justify-between pt-6 mt-8 border-t border-emerald-100">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-full border border-emerald-200 bg-white text-emerald-800 font-bold text-sm shadow-sm transition-all cursor-pointer hover:bg-emerald-50 ${
                    currentStep === 1 ? 'opacity-0 pointer-events-none' : ''
                  }`}
                >
                  <ArrowLeft className="w-4 h-4 text-emerald-600" />
                  <span>Previous</span>
                </button>

                <div className="text-xs text-emerald-700/80 font-semibold hidden sm:block">
                  Step {currentStep} of 4
                </div>

                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 transition-all cursor-pointer transform hover:-translate-y-0.5"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Real-Time Preview Card on Right */}
          <div className="w-full lg:w-auto">
            <LiveSummaryCard
              formData={formData}
              onFillSample={fillSampleData}
              onReset={resetForm}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-emerald-100 py-8 text-center text-xs text-emerald-700/80 font-serif">
        <p>GoPratle Technical Assignment • Event Requirement Platform</p>
      </footer>
    </div>
  );
}
