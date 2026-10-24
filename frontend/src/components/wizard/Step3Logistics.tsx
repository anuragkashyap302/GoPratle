'use client';

import React from 'react';
import { RequirementFormData } from '@/types/requirement';
import { IndianRupee, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';

interface Step3LogisticsProps {
  formData: RequirementFormData;
  errors: Record<string, string>;
  updateAdditionalDetails: (field: string, value: any) => void;
}

export const Step3Logistics: React.FC<Step3LogisticsProps> = ({
  formData,
  errors,
  updateAdditionalDetails
}) => {
  const { category } = formData;

  return (
    <div className="space-y-8 animate-fadeIn font-serif">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs uppercase font-bold tracking-wider px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
            {category.toUpperCase()} LOGISTICS & BUDGET
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-900 tracking-tight">
          Step 3: {category === 'planner' && 'Budget & Logistics Coordination'}
          {category === 'performer' && 'Artist Fee, Rider & Technical Setup'}
          {category === 'crew' && 'Shift Hours & Compensation'}
        </h2>
        <p className="text-sm text-emerald-700 italic mt-1">
          {category === 'planner' && 'Establish your budget boundaries and logistical expectations.'}
          {category === 'performer' && 'Clarify the sound setup, technical rider, and green room accommodations.'}
          {category === 'crew' && 'Set call times, shift durations, and rate compensation.'}
        </p>
      </div>

      {/* PLANNER LOGISTICS */}
      {category === 'planner' && (
        <div className="space-y-6">
          {/* Budget */}
          <div>
            <label className="text-emerald-800 text-sm font-semibold flex items-center gap-2 mb-1.5">
              <IndianRupee className="w-4 h-4 text-emerald-600" />
              Estimated Planning & Styling Budget (INR) <span className="text-emerald-600 font-bold">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-600 font-bold text-base">
                ₹
              </span>
              <input
                type="number"
                min={1000}
                step={5000}
                value={formData.plannerAdditionalDetails.budget || ''}
                onChange={(e) => updateAdditionalDetails('budget', parseInt(e.target.value, 10) || 0)}
                placeholder="250000"
                className={`w-full pl-10 pr-5 py-3 rounded-full border bg-white text-emerald-950 font-semibold text-sm shadow-sm focus:outline-none focus:ring-2 transition-all ${
                  errors.budget
                    ? 'border-rose-400 focus:ring-rose-200'
                    : 'border-emerald-200 focus:border-emerald-500 focus:ring-emerald-200'
                }`}
              />
            </div>
            {errors.budget && (
              <p className="text-xs text-rose-600 mt-1.5 flex items-center gap-1 font-sans">
                <AlertTriangle className="w-3.5 h-3.5" />
                {errors.budget}
              </p>
            )}
          </div>

          {/* Catering Coordination Toggle */}
          <div className="p-5 rounded-2xl bg-white border border-emerald-200 shadow-sm flex items-center justify-between">
            <div>
              <h4 className="text-base font-bold text-emerald-950">Include Catering & Bar Management?</h4>
              <p className="text-xs text-emerald-700 italic mt-0.5">
                Whether the planner should source catering vendors, menu tasting, and bar setups.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                updateAdditionalDetails('cateringCoordination', !formData.plannerAdditionalDetails.cateringCoordination)
              }
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                formData.plannerAdditionalDetails.cateringCoordination
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              {formData.plannerAdditionalDetails.cateringCoordination ? 'Included' : 'Not Required'}
            </button>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="text-emerald-800 text-sm font-semibold flex items-center gap-2 mb-1.5">
              Logistics Notes & Special Constraints <span className="text-gray-400 text-xs font-normal">(Optional)</span>
            </label>
            <textarea
              rows={3}
              value={formData.plannerAdditionalDetails.additionalNotes || ''}
              onChange={(e) => updateAdditionalDetails('additionalNotes', e.target.value)}
              placeholder="e.g., Strict midnight sound curfew, venue requires fire safety permits..."
              className="w-full px-5 py-3 rounded-2xl border border-emerald-200 bg-white text-emerald-950 placeholder-emerald-400 text-sm shadow-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all resize-none"
            />
          </div>
        </div>
      )}

      {/* PERFORMER LOGISTICS */}
      {category === 'performer' && (
        <div className="space-y-6">
          {/* Budget */}
          <div>
            <label className="text-emerald-800 text-sm font-semibold flex items-center gap-2 mb-1.5">
              <IndianRupee className="w-4 h-4 text-emerald-600" />
              Artist / Performer Fee Budget (INR) <span className="text-emerald-600 font-bold">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-600 font-bold text-base">
                ₹
              </span>
              <input
                type="number"
                min={500}
                step={2500}
                value={formData.performerAdditionalDetails.budget || ''}
                onChange={(e) => updateAdditionalDetails('budget', parseInt(e.target.value, 10) || 0)}
                placeholder="50000"
                className={`w-full pl-10 pr-5 py-3 rounded-full border bg-white text-emerald-950 font-semibold text-sm shadow-sm focus:outline-none focus:ring-2 transition-all ${
                  errors.budget
                    ? 'border-rose-400 focus:ring-rose-200'
                    : 'border-emerald-200 focus:border-emerald-500 focus:ring-emerald-200'
                }`}
              />
            </div>
            {errors.budget && (
              <p className="text-xs text-rose-600 mt-1.5 flex items-center gap-1 font-sans">
                <AlertTriangle className="w-3.5 h-3.5" />
                {errors.budget}
              </p>
            )}
          </div>

          {/* Sound System Provision */}
          <div className="p-5 rounded-2xl bg-white border border-emerald-200 shadow-sm flex items-center justify-between">
            <div>
              <h4 className="text-base font-bold text-emerald-950">Full Sound / PA System Provided?</h4>
              <p className="text-xs text-emerald-700 italic mt-0.5">
                Check if the venue or organizer provides the PA, amplifiers, and stage monitors.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                updateAdditionalDetails('soundSystemProvided', !formData.performerAdditionalDetails.soundSystemProvided)
              }
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                formData.performerAdditionalDetails.soundSystemProvided
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              {formData.performerAdditionalDetails.soundSystemProvided ? 'Yes, Venue Provided' : 'No, Artist Brings'}
            </button>
          </div>

          {/* Tech Rider */}
          <div>
            <label className="text-emerald-800 text-sm font-semibold flex items-center gap-2 mb-1.5">
              Technical Rider & Equipment Expectations <span className="text-gray-400 text-xs font-normal">(Optional)</span>
            </label>
            <textarea
              rows={2}
              value={formData.performerAdditionalDetails.technicalRider || ''}
              onChange={(e) => updateAdditionalDetails('technicalRider', e.target.value)}
              placeholder="e.g., 2 x Wireless Shure SM58 mics, DJ Console booth monitors, DI boxes for acoustic guitar..."
              className="w-full px-5 py-3 rounded-2xl border border-emerald-200 bg-white text-emerald-950 placeholder-emerald-400 text-sm shadow-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all resize-none"
            />
          </div>

          {/* Hospitality */}
          <div>
            <label className="text-emerald-800 text-sm font-semibold flex items-center gap-2 mb-1.5">
              Hospitality & Green Room Arrangements <span className="text-gray-400 text-xs font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={formData.performerAdditionalDetails.hospitalityNotes || ''}
              onChange={(e) => updateAdditionalDetails('hospitalityNotes', e.target.value)}
              placeholder="e.g., Private dressing room, dinner catering provided, airport shuttle"
              className="w-full px-5 py-3 rounded-full border border-emerald-200 bg-white text-emerald-950 placeholder-emerald-400 text-sm shadow-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
            />
          </div>
        </div>
      )}

      {/* CREW LOGISTICS */}
      {category === 'crew' && (
        <div className="space-y-6">
          {/* Rate Type & Amount */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-emerald-800 text-sm font-semibold flex items-center gap-2 mb-1.5">
                Compensation Rate Structure <span className="text-emerald-600 font-bold">*</span>
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => updateAdditionalDetails('budgetType', 'flat_daily_rate')}
                  className={`flex-1 py-3 px-3 rounded-full border text-xs font-bold transition-all cursor-pointer ${
                    formData.crewAdditionalDetails.budgetType === 'flat_daily_rate'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                      : 'bg-white text-emerald-800 border-emerald-200 hover:bg-emerald-50'
                  }`}
                >
                  Flat Daily Rate
                </button>
                <button
                  type="button"
                  onClick={() => updateAdditionalDetails('budgetType', 'hourly_rate')}
                  className={`flex-1 py-3 px-3 rounded-full border text-xs font-bold transition-all cursor-pointer ${
                    formData.crewAdditionalDetails.budgetType === 'hourly_rate'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                      : 'bg-white text-emerald-800 border-emerald-200 hover:bg-emerald-50'
                  }`}
                >
                  Hourly Rate
                </button>
              </div>
            </div>

            <div>
              <label className="text-emerald-800 text-sm font-semibold flex items-center gap-2 mb-1.5">
                <IndianRupee className="w-4 h-4 text-emerald-600" />
                Budget Amount (INR) <span className="text-emerald-600 font-bold">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-600 font-bold text-base">
                  ₹
                </span>
                <input
                  type="number"
                  min={200}
                  step={500}
                  value={formData.crewAdditionalDetails.budgetAmount || ''}
                  onChange={(e) => updateAdditionalDetails('budgetAmount', parseInt(e.target.value, 10) || 0)}
                  placeholder="15000"
                  className={`w-full pl-10 pr-5 py-3 rounded-full border bg-white text-emerald-950 font-semibold text-sm shadow-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.budgetAmount
                      ? 'border-rose-400 focus:ring-rose-200'
                      : 'border-emerald-200 focus:border-emerald-500 focus:ring-emerald-200'
                  }`}
                />
              </div>
              {errors.budgetAmount && (
                <p className="text-xs text-rose-600 mt-1.5 flex items-center gap-1 font-sans">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {errors.budgetAmount}
                </p>
              )}
            </div>
          </div>

          {/* Shift Call Time & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-emerald-800 text-sm font-semibold flex items-center gap-2 mb-1.5">
                <Clock className="w-4 h-4 text-emerald-600" />
                Shift Call Time <span className="text-emerald-600 font-bold">*</span>
              </label>
              <input
                type="text"
                value={formData.crewAdditionalDetails.shiftStartTime}
                onChange={(e) => updateAdditionalDetails('shiftStartTime', e.target.value)}
                placeholder="e.g., 08:30 AM or 14:00"
                className={`w-full px-5 py-3 rounded-full border bg-white text-emerald-950 text-sm shadow-sm focus:outline-none focus:ring-2 transition-all ${
                  errors.shiftStartTime
                    ? 'border-rose-400 focus:ring-rose-200'
                    : 'border-emerald-200 focus:border-emerald-500 focus:ring-emerald-200'
                }`}
              />
              {errors.shiftStartTime && (
                <p className="text-xs text-rose-600 mt-1.5 flex items-center gap-1 font-sans">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {errors.shiftStartTime}
                </p>
              )}
            </div>

            <div>
              <label className="text-emerald-800 text-sm font-semibold flex items-center gap-2 mb-1.5">
                Shift Duration (Hours)
              </label>
              <input
                type="number"
                min={1}
                max={24}
                value={formData.crewAdditionalDetails.shiftDurationHours}
                onChange={(e) => updateAdditionalDetails('shiftDurationHours', parseInt(e.target.value, 10) || 1)}
                className="w-full px-5 py-3 rounded-full border border-emerald-200 bg-white text-emerald-950 text-sm shadow-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
              />
            </div>
          </div>

          {/* Special Instructions */}
          <div>
            <label className="text-emerald-800 text-sm font-semibold flex items-center gap-2 mb-1.5">
              Special Instructions & Dress Code <span className="text-gray-400 text-xs font-normal">(Optional)</span>
            </label>
            <textarea
              rows={3}
              value={formData.crewAdditionalDetails.specialInstructions || ''}
              onChange={(e) => updateAdditionalDetails('specialInstructions', e.target.value)}
              placeholder="e.g., All crew must wear black formal attire. Safety shoes required during stage rigging."
              className="w-full px-5 py-3 rounded-2xl border border-emerald-200 bg-white text-emerald-950 placeholder-emerald-400 text-sm shadow-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all resize-none"
            />
          </div>
        </div>
      )}
    </div>
  );
};
