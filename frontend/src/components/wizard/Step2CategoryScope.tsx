'use client';

import React from 'react';
import { RequirementFormData } from '@/types/requirement';
import { Plus, Trash2, Clock, AlertTriangle, Users, Music2, Briefcase } from 'lucide-react';

interface Step2CategoryScopeProps {
  formData: RequirementFormData;
  errors: Record<string, string>;
  updateCategoryDetails: (field: string, value: any) => void;
}

const PLANNER_SERVICES = [
  { id: 'full_planning', label: 'Full Event Planning & Execution' },
  { id: 'day_of_coordination', label: 'Day-of Event Coordination' },
  { id: 'vendor_management', label: 'Vendor Sourcing & Contracting' },
  { id: 'decor_styling', label: 'Theme, Decor & Floral Styling' },
  { id: 'guest_hospitality', label: 'Guest Hospitality & RSVP Management' }
];

const GUEST_SCALES = ['< 100', '100 - 300', '300 - 800', '800+'] as const;

const PERFORMER_TYPES = [
  { value: 'dj', label: 'DJ / Electronic Music Artist' },
  { value: 'live_band', label: 'Live Band / Acoustic Ensemble' },
  { value: 'solo_instrumentalist', label: 'Solo Instrumentalist (Violin, Sax, Flute, Guitar)' },
  { value: 'singer', label: 'Singer / Vocalist' },
  { value: 'dancer', label: 'Dance Troupe / Performance Artists' },
  { value: 'magician_standup', label: 'Magician / Illusionist / Stand-up Comic' },
  { value: 'mc_host', label: 'Emcee / Event Anchor / Host' },
  { value: 'other', label: 'Other Special Performance' }
];

const SUGGESTED_CREW_ROLES = [
  'Sound & Audio Engineer',
  'Lighting & Stage Technician',
  'Camera & Videographer',
  'Stagehand & Runner',
  'Event Security / Bouncer',
  'Guest Registration & Usher'
];

export const Step2CategoryScope: React.FC<Step2CategoryScopeProps> = ({
  formData,
  errors,
  updateCategoryDetails
}) => {
  const { category } = formData;

  // Planner handlers
  const handleToggleService = (serviceId: string) => {
    const current = formData.plannerCategoryDetails.servicesNeeded || [];
    const next = current.includes(serviceId)
      ? current.filter((s) => s !== serviceId)
      : [...current, serviceId];
    updateCategoryDetails('servicesNeeded', next);
  };

  // Crew roles handlers
  const handleAddCrewRole = (roleTitle: string) => {
    const current = [...formData.crewCategoryDetails.crewRoles];
    const existingIndex = current.findIndex((r) => r.role.toLowerCase() === roleTitle.toLowerCase());
    if (existingIndex >= 0) {
      current[existingIndex].count += 1;
    } else {
      current.push({ role: roleTitle, count: 1 });
    }
    updateCategoryDetails('crewRoles', current);
  };

  const handleUpdateRoleCount = (index: number, delta: number) => {
    const current = [...formData.crewCategoryDetails.crewRoles];
    const newCount = current[index].count + delta;
    if (newCount <= 0) {
      current.splice(index, 1);
    } else {
      current[index].count = newCount;
    }
    updateCategoryDetails('crewRoles', current);
  };

  const handleRemoveRole = (index: number) => {
    const current = [...formData.crewCategoryDetails.crewRoles];
    current.splice(index, 1);
    updateCategoryDetails('crewRoles', current);
  };

  return (
    <div className="space-y-8 animate-fadeIn font-serif">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs uppercase font-bold tracking-wider px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
            {category.toUpperCase()} SCOPE
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-900 tracking-tight">
          Step 2: {category === 'planner' && 'Planning Scope & Event Scale'}
          {category === 'performer' && 'Performer & Entertainment Requirements'}
          {category === 'crew' && 'Crew Roles & On-Ground Headcount'}
        </h2>
        <p className="text-sm text-emerald-700 italic mt-1">
          {category === 'planner' && 'Specify the scale of your event and the exact planning services you need.'}
          {category === 'performer' && 'Define the performance genre, act type, and time requirements.'}
          {category === 'crew' && 'Add the technical and operational crew positions required for the event.'}
        </p>
      </div>

      {/* PLANNER ADAPTATION */}
      {category === 'planner' && (
        <div className="space-y-6">
          {/* Guest Scale */}
          <div>
            <label className="text-emerald-800 text-sm font-semibold flex items-center gap-2 mb-2">
              Expected Guest Scale <span className="text-emerald-600 font-bold">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {GUEST_SCALES.map((scale) => {
                const isSelected = formData.plannerCategoryDetails.guestCount === scale;
                return (
                  <button
                    key={scale}
                    type="button"
                    onClick={() => updateCategoryDetails('guestCount', scale)}
                    className={`py-3 px-4 rounded-full border text-center font-semibold text-sm transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-200'
                        : 'bg-white border-emerald-200 text-emerald-800 hover:bg-emerald-50'
                    }`}
                  >
                    {scale} Guests
                  </button>
                );
              })}
            </div>
          </div>

          {/* Services Needed */}
          <div>
            <label className="text-emerald-800 text-sm font-semibold flex items-center gap-2 mb-2">
              Planning Services Required <span className="text-emerald-600 font-bold">*</span>
            </label>
            <div className="space-y-2.5">
              {PLANNER_SERVICES.map((srv) => {
                const isChecked = formData.plannerCategoryDetails.servicesNeeded?.includes(srv.id);
                return (
                  <label
                    key={srv.id}
                    onClick={() => handleToggleService(srv.id)}
                    className={`flex items-center gap-3.5 p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isChecked
                        ? 'bg-emerald-50/70 border-emerald-500 text-emerald-950 font-semibold shadow-sm'
                        : 'bg-white border-emerald-100 text-gray-700 hover:border-emerald-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      readOnly
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-0 border-emerald-300"
                    />
                    <span className="text-sm">{srv.label}</span>
                  </label>
                );
              })}
            </div>
            {errors.servicesNeeded && (
              <p className="text-xs text-rose-600 mt-2 flex items-center gap-1 font-sans">
                <AlertTriangle className="w-3.5 h-3.5" />
                {errors.servicesNeeded}
              </p>
            )}
          </div>

          {/* Theme or Vision */}
          <div>
            <label className="text-emerald-800 text-sm font-semibold flex items-center gap-2 mb-1.5">
              Event Aesthetic, Color Theme or Vision <span className="text-gray-400 text-xs font-normal">(Optional)</span>
            </label>
            <textarea
              rows={3}
              value={formData.plannerCategoryDetails.themeOrVision || ''}
              onChange={(e) => updateCategoryDetails('themeOrVision', e.target.value)}
              placeholder="e.g., Minimalist pastel floral theme with warm vintage bistro lighting, champagne accents..."
              className="w-full px-5 py-3 rounded-2xl border border-emerald-200 bg-white text-emerald-950 placeholder-emerald-400 text-sm shadow-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all resize-none"
            />
          </div>
        </div>
      )}

      {/* PERFORMER ADAPTATION */}
      {category === 'performer' && (
        <div className="space-y-6">
          {/* Act Type & Performer Count */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-emerald-800 text-sm font-semibold flex items-center gap-2 mb-1.5">
                Type of Entertainment / Act <span className="text-emerald-600 font-bold">*</span>
              </label>
              <select
                value={formData.performerCategoryDetails.performanceType}
                onChange={(e) => updateCategoryDetails('performanceType', e.target.value)}
                className="w-full px-5 py-3 rounded-full border border-emerald-200 bg-white text-emerald-900 text-sm shadow-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all cursor-pointer"
              >
                {PERFORMER_TYPES.map((act) => (
                  <option key={act.value} value={act.value}>
                    {act.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-emerald-800 text-sm font-semibold flex items-center gap-2 mb-1.5">
                Number of Artists on Stage <span className="text-emerald-600 font-bold">*</span>
              </label>
              <input
                type="number"
                min={1}
                max={50}
                value={formData.performerCategoryDetails.performerCount}
                onChange={(e) => updateCategoryDetails('performerCount', parseInt(e.target.value, 10) || 1)}
                className="w-full px-5 py-3 rounded-full border border-emerald-200 bg-white text-emerald-950 text-sm shadow-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
              />
            </div>
          </div>

          {/* Genre & Set Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-emerald-800 text-sm font-semibold flex items-center gap-2 mb-1.5">
                Musical Genre / Act Style <span className="text-emerald-600 font-bold">*</span>
              </label>
              <input
                type="text"
                value={formData.performerCategoryDetails.genreOrStyle}
                onChange={(e) => updateCategoryDetails('genreOrStyle', e.target.value)}
                placeholder="e.g., Bollywood Hits, Sufi Fusion, Techno, Jazz"
                className={`w-full px-5 py-3 rounded-full border bg-white text-emerald-950 placeholder-emerald-400 text-sm shadow-sm focus:outline-none focus:ring-2 transition-all ${
                  errors.genreOrStyle
                    ? 'border-rose-400 focus:ring-rose-200'
                    : 'border-emerald-200 focus:border-emerald-500 focus:ring-emerald-200'
                }`}
              />
              {errors.genreOrStyle && (
                <p className="text-xs text-rose-600 mt-1.5 flex items-center gap-1 font-sans">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {errors.genreOrStyle}
                </p>
              )}
            </div>

            <div>
              <label className="text-emerald-800 text-sm font-semibold flex items-center justify-between mb-1.5">
                <span>Set Duration (Minutes) <span className="text-emerald-600 font-bold">*</span></span>
                <span className="text-emerald-700 font-bold text-xs">
                  {formData.performerCategoryDetails.durationMinutes} mins
                </span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={15}
                  max={360}
                  step={15}
                  value={formData.performerCategoryDetails.durationMinutes}
                  onChange={(e) => updateCategoryDetails('durationMinutes', parseInt(e.target.value, 10))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <input
                  type="number"
                  min={15}
                  max={480}
                  step={15}
                  value={formData.performerCategoryDetails.durationMinutes}
                  onChange={(e) => updateCategoryDetails('durationMinutes', parseInt(e.target.value, 10) || 15)}
                  className="w-24 px-3 py-2 rounded-full bg-white border border-emerald-200 text-center text-xs font-bold text-emerald-900 shadow-sm"
                />
              </div>
              {errors.durationMinutes && (
                <p className="text-xs text-rose-600 mt-1.5 flex items-center gap-1 font-sans">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {errors.durationMinutes}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CREW ADAPTATION */}
      {category === 'crew' && (
        <div className="space-y-6">
          {/* Quick role adder */}
          <div>
            <label className="text-emerald-800 text-sm font-semibold flex items-center gap-2 mb-2">
              Add Common Crew Roles
            </label>
            <div className="flex flex-wrap gap-2 mb-4">
              {SUGGESTED_CREW_ROLES.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleAddCrewRole(role)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-emerald-200 text-emerald-800 text-xs font-semibold hover:bg-emerald-50 hover:border-emerald-400 transition-all cursor-pointer shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{role}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Active Crew Roles List */}
          <div>
            <label className="text-emerald-800 text-sm font-semibold flex items-center gap-2 mb-2">
              Specified Roles & Headcount <span className="text-emerald-600 font-bold">*</span>
            </label>
            {formData.crewCategoryDetails.crewRoles.length === 0 ? (
              <div className="p-6 rounded-2xl bg-emerald-50/50 border border-dashed border-emerald-200 text-center text-emerald-700 text-xs">
                No crew roles added yet. Click any of the quick suggestions above to add positions.
              </div>
            ) : (
              <div className="space-y-2.5">
                {formData.crewCategoryDetails.crewRoles.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-2xl bg-white border border-emerald-200 shadow-sm"
                  >
                    <span className="text-sm font-bold text-emerald-950">{item.role}</span>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                        <button
                          type="button"
                          onClick={() => handleUpdateRoleCount(index, -1)}
                          className="w-5 h-5 rounded-full flex items-center justify-center text-emerald-800 font-bold hover:bg-emerald-200 transition-colors"
                        >
                          -
                        </button>
                        <span className="text-xs font-extrabold text-emerald-900 w-6 text-center">
                          {item.count}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdateRoleCount(index, 1)}
                          className="w-5 h-5 rounded-full flex items-center justify-center text-emerald-800 font-bold hover:bg-emerald-200 transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveRole(index)}
                        className="text-gray-400 hover:text-rose-600 transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {errors.crewRoles && (
              <p className="text-xs text-rose-600 mt-2 flex items-center gap-1 font-sans">
                <AlertTriangle className="w-3.5 h-3.5" />
                {errors.crewRoles}
              </p>
            )}
          </div>

          {/* Experience & Equipment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-emerald-800 text-sm font-semibold flex items-center gap-2 mb-1.5">
                Experience Level Required
              </label>
              <select
                value={formData.crewCategoryDetails.experienceLevel}
                onChange={(e) => updateCategoryDetails('experienceLevel', e.target.value)}
                className="w-full px-5 py-3 rounded-full border border-emerald-200 bg-white text-emerald-900 text-sm shadow-sm focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="entry">Entry Level / General Staff</option>
                <option value="experienced">Experienced (2 - 5 Years)</option>
                <option value="expert">Lead / Expert Technicians (5+ Years)</option>
              </select>
            </div>

            <div>
              <label className="text-emerald-800 text-sm font-semibold flex items-center gap-2 mb-1.5">
                Equipment Handling
              </label>
              <select
                value={formData.crewCategoryDetails.equipmentHandling}
                onChange={(e) => updateCategoryDetails('equipmentHandling', e.target.value)}
                className="w-full px-5 py-3 rounded-full border border-emerald-200 bg-white text-emerald-900 text-sm shadow-sm focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="venue_provides_gear">Venue Provides All Gear</option>
                <option value="crew_brings_gear">Crew Brings Own Gear</option>
                <option value="mixed_rental">Mixed / External Rental Vendor</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
