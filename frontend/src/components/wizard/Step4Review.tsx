'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { RequirementFormData, RequirementDoc } from '@/types/requirement';
import { CATEGORY_META } from '@/lib/constants';
import {
  CheckCircle2,
  Calendar,
  MapPin,
  Edit2,
  Send,
  Loader2,
  AlertCircle,
  Copy,
  Check,
  Code,
  ArrowRight,
  PlusCircle
} from 'lucide-react';

interface Step4ReviewProps {
  formData: RequirementFormData;
  isSubmitting: boolean;
  submitResult: RequirementDoc | null;
  apiError: string | null;
  goToStep: (step: number) => void;
  onSubmit: () => void;
  onReset: () => void;
}

export const Step4Review: React.FC<Step4ReviewProps> = ({
  formData,
  isSubmitting,
  submitResult,
  apiError,
  goToStep,
  onSubmit,
  onReset
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [showRawJson, setShowRawJson] = useState<boolean>(false);
  const meta = CATEGORY_META[formData.category];

  // Fire celebration confetti on successful save
  useEffect(() => {
    if (submitResult) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  }, [submitResult]);

  const copyIdToClipboard = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'Not set';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  // SUCCESS CONFIRMATION STATE
  if (submitResult) {
    return (
      <div className="space-y-6 animate-fadeIn text-center py-6 font-serif">
        {/* Success Icon */}
        <div className="w-20 h-20 rounded-full bg-emerald-100 border-4 border-emerald-300 flex items-center justify-center text-emerald-700 mx-auto shadow-lg shadow-emerald-500/10">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div>
          <span className="text-xs uppercase font-bold tracking-wider px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
            Requirement Saved to MongoDB
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-950 mt-3 tracking-tight">
            Requirement Successfully Posted!
          </h2>
          <p className="text-sm text-emerald-700 italic mt-1.5 max-w-md mx-auto">
            Your event requirement has been verified, categorized under{' '}
            <strong className="text-emerald-900 not-italic font-bold">{meta.title}</strong>, and permanently stored in the database.
          </p>
        </div>

        {/* Reference ID Card */}
        <div className="max-w-md mx-auto p-4 rounded-2xl bg-white border border-emerald-200 text-left shadow-md">
          <p className="text-[11px] text-emerald-700 uppercase font-bold">MongoDB Requirement ID</p>
          <div className="flex items-center justify-between mt-1">
            <code className="text-xs sm:text-sm font-mono text-emerald-800 font-bold break-all">
              {submitResult._id}
            </code>
            <button
              type="button"
              onClick={() => copyIdToClipboard(submitResult._id)}
              className="flex items-center gap-1.5 ml-3 px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors flex-shrink-0 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/requirements"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <span>Browse in Feed</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <button
            type="button"
            onClick={onReset}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white hover:bg-emerald-50 text-emerald-800 font-bold text-sm border border-emerald-200 transition-all cursor-pointer shadow-sm"
          >
            <PlusCircle className="w-4 h-4 text-emerald-600" />
            <span>Post Another Requirement</span>
          </button>
        </div>

        {/* Raw JSON Inspector for Recruiter Verification */}
        <div className="max-w-xl mx-auto pt-4 text-left">
          <button
            type="button"
            onClick={() => setShowRawJson(!showRawJson)}
            className="flex items-center gap-2 text-xs font-semibold text-emerald-700 hover:text-emerald-900 transition-colors mx-auto cursor-pointer"
          >
            <Code className="w-3.5 h-3.5 text-emerald-600" />
            <span>{showRawJson ? 'Hide Raw MongoDB Document' : 'Inspect Raw MongoDB Document'}</span>
          </button>

          {showRawJson && (
            <div className="mt-3 p-4 rounded-2xl bg-emerald-950 text-emerald-300 border border-emerald-800 overflow-x-auto text-left text-xs font-mono">
              <pre>{JSON.stringify(submitResult, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    );
  }

  // REVIEW FORM STATE
  return (
    <div className="space-y-8 animate-fadeIn font-serif">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-900 tracking-tight">
          Step 4: Review Details & Submit
        </h2>
        <p className="text-sm text-emerald-700 italic mt-1">
          Review all information below before submitting. Click any edit button to make quick changes.
        </p>
      </div>

      {/* Error banner if API failure */}
      {apiError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3 text-xs sm:text-sm font-sans">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-rose-900">Submission Failed</h4>
            <p className="whitespace-pre-line leading-relaxed">{apiError}</p>
          </div>
        </div>
      )}

      {/* Section 1: Event Basics */}
      <div className="p-6 rounded-3xl bg-white border border-emerald-200 shadow-sm relative group">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-emerald-100">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
              1
            </span>
            <h3 className="text-base font-bold text-emerald-950 uppercase tracking-wider">Event Basics</h3>
          </div>
          <button
            type="button"
            onClick={() => goToStep(1)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-all cursor-pointer"
          >
            <Edit2 className="w-3 h-3" />
            <span>Edit</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-xs">
          <div>
            <span className="text-gray-500">Event Title:</span>
            <p className="font-bold text-emerald-950 text-sm mt-0.5">{formData.eventName}</p>
          </div>
          <div>
            <span className="text-gray-500">Category:</span>
            <p className="font-bold text-emerald-700 text-sm mt-0.5 capitalize">{meta.title}</p>
          </div>
          <div>
            <span className="text-gray-500">Event Type:</span>
            <p className="font-semibold text-emerald-900 mt-0.5 capitalize">
              {formData.eventType.replace('_', ' ')}
            </p>
          </div>
          <div>
            <span className="text-gray-500">Date(s):</span>
            <p className="font-semibold text-emerald-900 mt-0.5">
              {formatDate(formData.startDate)}
              {formData.isMultiDay && ` → ${formatDate(formData.endDate)}`}
            </p>
          </div>
          <div>
            <span className="text-gray-500">Location:</span>
            <p className="font-semibold text-emerald-900 mt-0.5">{formData.location}</p>
          </div>
          {formData.venue && (
            <div>
              <span className="text-gray-500">Venue:</span>
              <p className="font-semibold text-emerald-900 mt-0.5">{formData.venue}</p>
            </div>
          )}
        </div>
      </div>

      {/* Section 2: Category Scope */}
      <div className="p-6 rounded-3xl bg-white border border-emerald-200 shadow-sm relative group">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-emerald-100">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
              2
            </span>
            <h3 className="text-base font-bold text-emerald-950 uppercase tracking-wider">
              {formData.category.toUpperCase()} Scope Details
            </h3>
          </div>
          <button
            type="button"
            onClick={() => goToStep(2)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-all cursor-pointer"
          >
            <Edit2 className="w-3 h-3" />
            <span>Edit</span>
          </button>
        </div>

        {formData.category === 'planner' && (
          <div className="space-y-3 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">Guest Scale:</span>
              <span className="font-bold text-emerald-900">
                {formData.plannerCategoryDetails.guestCount} guests
              </span>
            </div>
            <div>
              <span className="text-gray-500">Services Needed:</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {formData.plannerCategoryDetails.servicesNeeded?.map((s) => (
                  <span
                    key={s}
                    className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-medium border border-emerald-200"
                  >
                    {s.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
            {formData.plannerCategoryDetails.themeOrVision && (
              <div>
                <span className="text-gray-500">Theme / Aesthetic Vision:</span>
                <p className="text-emerald-800 italic mt-0.5">
                  &ldquo;{formData.plannerCategoryDetails.themeOrVision}&rdquo;
                </p>
              </div>
            )}
          </div>
        )}

        {formData.category === 'performer' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-xs">
            <div>
              <span className="text-gray-500">Performance Act:</span>
              <p className="font-bold text-emerald-900 mt-0.5 uppercase">
                {formData.performerCategoryDetails.performanceType.replace('_', ' ')}
              </p>
            </div>
            <div>
              <span className="text-gray-500">Musical Genre / Style:</span>
              <p className="font-semibold text-emerald-900 mt-0.5">
                {formData.performerCategoryDetails.genreOrStyle}
              </p>
            </div>
            <div>
              <span className="text-gray-500">Set Duration:</span>
              <p className="font-semibold text-emerald-900 mt-0.5">
                {formData.performerCategoryDetails.durationMinutes} minutes
              </p>
            </div>
            <div>
              <span className="text-gray-500">Artists on Stage:</span>
              <p className="font-semibold text-emerald-900 mt-0.5">
                {formData.performerCategoryDetails.performerCount}
              </p>
            </div>
          </div>
        )}

        {formData.category === 'crew' && (
          <div className="space-y-3 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">Experience Level:</span>
              <span className="font-bold text-emerald-900 capitalize">
                {formData.crewCategoryDetails.experienceLevel}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Equipment Arrangement:</span>
              <span className="font-semibold text-emerald-900">
                {formData.crewCategoryDetails.equipmentHandling.replace(/_/g, ' ')}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Roles & Headcount:</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {formData.crewCategoryDetails.crewRoles.map((r, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-200"
                  >
                    {r.role} × <strong className="text-emerald-900 font-bold">{r.count}</strong>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Section 3: Logistics & Budget */}
      <div className="p-6 rounded-3xl bg-white border border-emerald-200 shadow-sm relative group">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-emerald-100">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
              3
            </span>
            <h3 className="text-base font-bold text-emerald-950 uppercase tracking-wider">
              Logistics & Compensation
            </h3>
          </div>
          <button
            type="button"
            onClick={() => goToStep(3)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-all cursor-pointer"
          >
            <Edit2 className="w-3 h-3" />
            <span>Edit</span>
          </button>
        </div>

        {formData.category === 'planner' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-xs">
            <div>
              <span className="text-gray-500">Estimated Budget:</span>
              <p className="font-extrabold text-emerald-800 text-base mt-0.5">
                ₹{(formData.plannerAdditionalDetails.budget || 0).toLocaleString('en-IN')}
              </p>
            </div>
            <div>
              <span className="text-gray-500">Catering Coordination:</span>
              <p className="font-semibold text-emerald-900 mt-0.5">
                {formData.plannerAdditionalDetails.cateringCoordination ? 'Yes, Included' : 'No'}
              </p>
            </div>
            {formData.plannerAdditionalDetails.additionalNotes && (
              <div className="sm:col-span-2">
                <span className="text-gray-500">Notes & Constraints:</span>
                <p className="text-emerald-800 mt-0.5">
                  {formData.plannerAdditionalDetails.additionalNotes}
                </p>
              </div>
            )}
          </div>
        )}

        {formData.category === 'performer' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-xs">
            <div>
              <span className="text-gray-500">Artist Budget:</span>
              <p className="font-extrabold text-emerald-800 text-base mt-0.5">
                ₹{(formData.performerAdditionalDetails.budget || 0).toLocaleString('en-IN')}
              </p>
            </div>
            <div>
              <span className="text-gray-500">Sound / PA System:</span>
              <p className="font-semibold text-emerald-900 mt-0.5">
                {formData.performerAdditionalDetails.soundSystemProvided
                  ? 'Provided by Organizer'
                  : 'Artist to Bring'}
              </p>
            </div>
            {formData.performerAdditionalDetails.technicalRider && (
              <div className="sm:col-span-2">
                <span className="text-gray-500">Tech Rider Specs:</span>
                <p className="text-emerald-800 mt-0.5">
                  {formData.performerAdditionalDetails.technicalRider}
                </p>
              </div>
            )}
          </div>
        )}

        {formData.category === 'crew' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-xs">
            <div>
              <span className="text-gray-500">Rate Compensation:</span>
              <p className="font-extrabold text-emerald-800 text-base mt-0.5">
                ₹{(formData.crewAdditionalDetails.budgetAmount || 0).toLocaleString('en-IN')}{' '}
                <span className="text-xs font-normal text-gray-500">
                  ({formData.crewAdditionalDetails.budgetType === 'hourly_rate' ? 'Hourly' : 'Flat Day'})
                </span>
              </p>
            </div>
            <div>
              <span className="text-gray-500">Shift Call Time:</span>
              <p className="font-semibold text-emerald-900 mt-0.5">
                {formData.crewAdditionalDetails.shiftStartTime} ({formData.crewAdditionalDetails.shiftDurationHours} hrs)
              </p>
            </div>
            {formData.crewAdditionalDetails.specialInstructions && (
              <div className="sm:col-span-2">
                <span className="text-gray-500">Special Instructions:</span>
                <p className="text-emerald-800 mt-0.5">
                  {formData.crewAdditionalDetails.specialInstructions}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Submission trigger */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="w-full py-4 px-8 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-base shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-2.5 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Validating & Saving to MongoDB...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Submit & Post Requirement</span>
            </>
          )}
        </button>
        <p className="text-center text-xs text-emerald-700/80 mt-2.5 italic">
          By submitting, this requirement will be permanently saved into MongoDB categorized under{' '}
          <strong className="text-emerald-900 not-italic font-bold">{formData.category.toUpperCase()}</strong>.
        </p>
      </div>
    </div>
  );
};
