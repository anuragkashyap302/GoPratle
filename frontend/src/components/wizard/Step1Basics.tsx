'use client';

import React from 'react';
import { RequirementFormData, EventCategory, EventType } from '@/types/requirement';
import { Briefcase, Music2, Users, Calendar, MapPin, Building, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface Step1BasicsProps {
  formData: RequirementFormData;
  errors: Record<string, string>;
  updateField: <K extends keyof RequirementFormData>(key: K, value: RequirementFormData[K]) => void;
  setCategory: (cat: EventCategory) => void;
}

const EVENT_TYPES: Array<{ value: EventType; label: string }> = [
  { value: 'wedding', label: 'Wedding' },
  { value: 'corporate', label: 'Corporate Event' },
  { value: 'concert', label: 'Concert / Music Fest' },
  { value: 'private_party', label: 'Private Party' },
  { value: 'festival', label: 'Cultural / Festival' },
  { value: 'other', label: 'Other Event' }
];

const CATEGORIES: Array<{
  id: EventCategory;
  title: string;
  subtitle: string;
  desc: string;
  icon: any;
}> = [
  {
    id: 'planner',
    title: 'Event Planner',
    subtitle: 'Planning & Styling',
    desc: 'For full event coordination, venue scouting, decor styling, and day-of execution.',
    icon: Briefcase
  },
  {
    id: 'performer',
    title: 'Performer / Artist',
    subtitle: 'Live Entertainment',
    desc: 'For live bands, DJs, solo musicians, dancers, magicians, stand-up comics, or anchors.',
    icon: Music2
  },
  {
    id: 'crew',
    title: 'Event Crew',
    subtitle: 'On-Ground & Tech Staff',
    desc: 'For sound engineers, lighting techs, videographers, stagehands, security, and ushers.',
    icon: Users
  }
];

export const Step1Basics: React.FC<Step1BasicsProps> = ({
  formData,
  errors,
  updateField,
  setCategory
}) => {
  return (
    <div className="space-y-8 animate-fadeIn font-serif">
      {/* Step Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-900 tracking-tight">
          Step 1: Event Basics & Requirement Category
        </h2>
        <p className="text-sm text-emerald-700 italic mt-1">
          Tell us about your event. Your category choice will dynamically configure the specialized questions in the next steps.
        </p>
      </div>

      {/* Category Selector Cards */}
      <div className="space-y-3">
        <label className="text-emerald-800 text-sm font-semibold flex items-center gap-2">
          Select Category to Hire For <span className="text-emerald-600 font-bold">*</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CATEGORIES.map((cat) => {
            const isSelected = formData.category === cat.id;
            const Icon = cat.icon;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={`relative text-left p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-emerald-50/70 border-emerald-600 shadow-md ring-2 ring-emerald-200 transform -translate-y-1'
                    : 'bg-white border-emerald-100 hover:border-emerald-300 hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    {isSelected && (
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-600 text-white shadow-sm flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Selected</span>
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-emerald-950 text-base">{cat.title}</h4>
                  <p className="text-xs text-emerald-700 font-semibold mb-1.5">{cat.subtitle}</p>
                  <p className="text-xs text-gray-600 leading-relaxed font-sans">{cat.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-5 pt-4 border-t border-emerald-100">
        {/* Event Name */}
        <div>
          <label className="text-emerald-800 text-sm font-semibold flex items-center gap-2 mb-1.5">
            Event Name <span className="text-emerald-600 font-bold">*</span>
          </label>
          <input
            type="text"
            value={formData.eventName}
            onChange={(e) => updateField('eventName', e.target.value)}
            placeholder="e.g., Annual Tech Conclave 2027 or Royal Heritage Wedding"
            className={`w-full px-5 py-3 rounded-full border bg-white text-emerald-950 placeholder-emerald-400 text-sm shadow-sm focus:outline-none focus:ring-2 transition-all ${
              errors.eventName
                ? 'border-rose-400 focus:ring-rose-200'
                : 'border-emerald-200 focus:border-emerald-500 focus:ring-emerald-200'
            }`}
          />
          {errors.eventName && (
            <p className="text-xs text-rose-600 mt-1.5 flex items-center gap-1 font-sans">
              <AlertTriangle className="w-3.5 h-3.5" />
              {errors.eventName}
            </p>
          )}
        </div>

        {/* Event Type & Multi-day toggle */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-emerald-800 text-sm font-semibold flex items-center gap-2 mb-1.5">
              Event Type <span className="text-emerald-600 font-bold">*</span>
            </label>
            <select
              value={formData.eventType}
              onChange={(e) => updateField('eventType', e.target.value as EventType)}
              className="w-full px-5 py-3 rounded-full border border-emerald-200 bg-white text-emerald-900 text-sm shadow-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all cursor-pointer"
            >
              {EVENT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-emerald-800 text-sm font-semibold flex items-center gap-2 mb-1.5">
              Event Duration
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => updateField('isMultiDay', false)}
                className={`flex-1 py-2.5 px-4 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
                  !formData.isMultiDay
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                    : 'bg-white text-emerald-800 border-emerald-200 hover:bg-emerald-50'
                }`}
              >
                Single Day Event
              </button>
              <button
                type="button"
                onClick={() => updateField('isMultiDay', true)}
                className={`flex-1 py-2.5 px-4 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
                  formData.isMultiDay
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                    : 'bg-white text-emerald-800 border-emerald-200 hover:bg-emerald-50'
                }`}
              >
                Multi-Day Range
              </button>
            </div>
          </div>
        </div>

        {/* Dates row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-emerald-800 text-sm font-semibold flex items-center gap-2 mb-1.5">
              <Calendar className="w-4 h-4 text-emerald-600" />
              {formData.isMultiDay ? 'Event Start Date' : 'Event Date'}{' '}
              <span className="text-emerald-600 font-bold">*</span>
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => updateField('startDate', e.target.value)}
              className={`w-full px-5 py-3 rounded-full border bg-white text-emerald-950 text-sm shadow-sm focus:outline-none focus:ring-2 transition-all ${
                errors.startDate
                  ? 'border-rose-400 focus:ring-rose-200'
                  : 'border-emerald-200 focus:border-emerald-500 focus:ring-emerald-200'
              }`}
            />
            {errors.startDate && (
              <p className="text-xs text-rose-600 mt-1.5 flex items-center gap-1 font-sans">
                <AlertTriangle className="w-3.5 h-3.5" />
                {errors.startDate}
              </p>
            )}
          </div>

          {formData.isMultiDay && (
            <div>
              <label className="text-emerald-800 text-sm font-semibold flex items-center gap-2 mb-1.5">
                <Calendar className="w-4 h-4 text-emerald-600" />
                Event End Date <span className="text-emerald-600 font-bold">*</span>
              </label>
              <input
                type="date"
                value={formData.endDate}
                min={formData.startDate || undefined}
                onChange={(e) => updateField('endDate', e.target.value)}
                className={`w-full px-5 py-3 rounded-full border bg-white text-emerald-950 text-sm shadow-sm focus:outline-none focus:ring-2 transition-all ${
                  errors.endDate
                    ? 'border-rose-400 focus:ring-rose-200'
                    : 'border-emerald-200 focus:border-emerald-500 focus:ring-emerald-200'
                }`}
              />
              {errors.endDate && (
                <p className="text-xs text-rose-600 mt-1.5 flex items-center gap-1 font-sans">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {errors.endDate}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Location & Optional Venue */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-emerald-800 text-sm font-semibold flex items-center gap-2 mb-1.5">
              <MapPin className="w-4 h-4 text-emerald-600" />
              City / Location <span className="text-emerald-600 font-bold">*</span>
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => updateField('location', e.target.value)}
              placeholder="e.g., Bengaluru, Karnataka or Goa"
              className={`w-full px-5 py-3 rounded-full border bg-white text-emerald-950 placeholder-emerald-400 text-sm shadow-sm focus:outline-none focus:ring-2 transition-all ${
                errors.location
                  ? 'border-rose-400 focus:ring-rose-200'
                  : 'border-emerald-200 focus:border-emerald-500 focus:ring-emerald-200'
              }`}
            />
            {errors.location && (
              <p className="text-xs text-rose-600 mt-1.5 flex items-center gap-1 font-sans">
                <AlertTriangle className="w-3.5 h-3.5" />
                {errors.location}
              </p>
            )}
          </div>

          <div>
            <label className="text-emerald-800 text-sm font-semibold flex items-center gap-2 mb-1.5">
              <Building className="w-4 h-4 text-emerald-600" />
              Venue Details <span className="text-gray-400 text-xs font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={formData.venue}
              onChange={(e) => updateField('venue', e.target.value)}
              placeholder="e.g., Grand Ballroom, The Leela"
              className="w-full px-5 py-3 rounded-full border border-emerald-200 bg-white text-emerald-950 placeholder-emerald-400 text-sm shadow-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
