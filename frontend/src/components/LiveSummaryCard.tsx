'use client';

import React from 'react';
import { RequirementFormData } from '@/types/requirement';
import { CATEGORY_META } from '@/lib/constants';
import {
  Calendar,
  MapPin,
  Briefcase,
  Music2,
  Users,
  IndianRupee,
  RotateCcw,
  Wand2,
  Clock,
  Layers,
  Tag
} from 'lucide-react';

interface LiveSummaryCardProps {
  formData: RequirementFormData;
  onFillSample: () => void;
  onReset: () => void;
}

export const LiveSummaryCard: React.FC<LiveSummaryCardProps> = ({
  formData,
  onFillSample,
  onReset
}) => {
  const meta = CATEGORY_META[formData.category];

  // Helper for formatted dates
  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'Not selected';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  // Helper for budget
  const getBudgetDisplay = () => {
    if (formData.category === 'planner') {
      return `₹${(formData.plannerAdditionalDetails.budget || 0).toLocaleString('en-IN')}`;
    } else if (formData.category === 'performer') {
      return `₹${(formData.performerAdditionalDetails.budget || 0).toLocaleString('en-IN')}`;
    } else {
      const rateType = formData.crewAdditionalDetails.budgetType === 'hourly_rate' ? '/ hr' : '/ day';
      return `₹${(formData.crewAdditionalDetails.budgetAmount || 0).toLocaleString('en-IN')} ${rateType}`;
    }
  };

  return (
    <aside className="w-full lg:w-80 xl:w-96 flex-shrink-0 space-y-4 font-serif">
      {/* Top action pill toolbar */}
      <div className="flex items-center justify-between px-2">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-emerald-600" />
          Requirement Summary
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onFillSample}
            title="Auto-fill with realistic demo data for testing"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all cursor-pointer"
          >
            <Wand2 className="w-3 h-3" />
            <span>Fill Demo</span>
          </button>
          <button
            type="button"
            onClick={onReset}
            title="Reset form and clear local draft"
            className="p-1.5 rounded-full text-emerald-700 hover:bg-emerald-100/70 border border-emerald-200 bg-white transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Booking Summary Card (As styled in Screenshot 2) */}
      <div className="relative rounded-3xl bg-white/90 backdrop-blur-md border-2 border-emerald-200/80 p-6 shadow-xl shadow-emerald-900/5 overflow-hidden">
        {/* Category Header */}
        <div className="flex items-center justify-between pb-4 border-b border-emerald-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 shadow-sm">
              {formData.category === 'planner' && <Briefcase className="w-5 h-5" />}
              {formData.category === 'performer' && <Music2 className="w-5 h-5" />}
              {formData.category === 'crew' && <Users className="w-5 h-5" />}
            </div>
            <div>
              <p className="text-[11px] text-emerald-600 font-medium">Category</p>
              <h4 className="text-base font-bold text-emerald-900">{meta.title}</h4>
            </div>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
            {formData.eventType.replace('_', ' ')}
          </span>
        </div>

        {/* Event Title & Location */}
        <div className="py-4 border-b border-emerald-100 space-y-1.5">
          <p className="text-xs text-emerald-600 font-medium">Event Title</p>
          <h3 className="text-lg font-bold text-emerald-950 tracking-tight line-clamp-2">
            {formData.eventName || 'Untitled Event Requirement'}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 mt-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
            <span className="truncate">{formData.location || 'Location not specified'}</span>
          </div>
          {formData.venue && (
            <p className="text-[11px] text-emerald-600/80 pl-5 truncate">@ {formData.venue}</p>
          )}
        </div>

        {/* Dates Display Container */}
        <div className="my-4 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-3.5 flex items-center gap-3">
          <Calendar className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <div className="text-xs">
            <p className="text-emerald-700 text-[10px] uppercase font-semibold">Event Date(s)</p>
            <p className="font-bold text-emerald-900">
              {formatDate(formData.startDate)}
              {formData.isMultiDay && formData.endDate && ` → ${formatDate(formData.endDate)}`}
            </p>
          </div>
        </div>

        {/* Dynamic Category Preview */}
        <div className="space-y-3 py-2 text-xs">
          {formData.category === 'planner' && (
            <>
              <div className="flex justify-between items-center text-emerald-800">
                <span className="text-gray-500">Guest Scale:</span>
                <span className="font-bold text-emerald-900">{formData.plannerCategoryDetails.guestCount} guests</span>
              </div>
              <div className="flex justify-between items-start text-emerald-800">
                <span className="text-gray-500">Services:</span>
                <span className="font-semibold text-emerald-900 text-right max-w-[170px] truncate">
                  {formData.plannerCategoryDetails.servicesNeeded?.length
                    ? formData.plannerCategoryDetails.servicesNeeded.map((s) => s.replace('_', ' ')).join(', ')
                    : 'None selected'}
                </span>
              </div>
              {formData.plannerCategoryDetails.themeOrVision && (
                <div className="p-3 rounded-xl bg-emerald-50/40 border border-emerald-100 text-xs text-emerald-800 italic line-clamp-2">
                  &ldquo;{formData.plannerCategoryDetails.themeOrVision}&rdquo;
                </div>
              )}
            </>
          )}

          {formData.category === 'performer' && (
            <>
              <div className="flex justify-between items-center text-emerald-800">
                <span className="text-gray-500">Act Type:</span>
                <span className="font-bold text-emerald-900 uppercase">
                  {formData.performerCategoryDetails.performanceType.replace('_', ' ')}
                </span>
              </div>
              <div className="flex justify-between items-center text-emerald-800">
                <span className="text-gray-500">Genre / Style:</span>
                <span className="font-semibold text-emerald-900 truncate max-w-[160px]">
                  {formData.performerCategoryDetails.genreOrStyle || 'Not specified'}
                </span>
              </div>
              <div className="flex justify-between items-center text-emerald-800">
                <span className="text-gray-500">Duration:</span>
                <span className="font-bold text-emerald-900 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  {formData.performerCategoryDetails.durationMinutes} mins
                </span>
              </div>
            </>
          )}

          {formData.category === 'crew' && (
            <>
              <div className="flex justify-between items-center text-emerald-800">
                <span className="text-gray-500">Experience:</span>
                <span className="font-bold text-emerald-900 capitalize">
                  {formData.crewCategoryDetails.experienceLevel}
                </span>
              </div>
              <div className="flex justify-between items-center text-emerald-800">
                <span className="text-gray-500">Equipment:</span>
                <span className="font-semibold text-emerald-900 text-[11px]">
                  {formData.crewCategoryDetails.equipmentHandling.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="space-y-1 pt-1">
                <span className="text-[10px] text-emerald-700 uppercase tracking-wider font-semibold">Roles</span>
                <div className="flex flex-wrap gap-1.5">
                  {formData.crewCategoryDetails.crewRoles.map((r, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-medium border border-emerald-200"
                    >
                      {r.role} ({r.count})
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Budget Footer Capsule */}
        <div className="mt-4 pt-4 border-t border-emerald-100 flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase font-bold text-emerald-700 tracking-wider">
              Budget / Rate
            </span>
            <p className="text-lg font-bold text-emerald-800 mt-0.5">
              {getBudgetDisplay()}
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
            Open Requirement
          </span>
        </div>
      </div>
    </aside>
  );
};
