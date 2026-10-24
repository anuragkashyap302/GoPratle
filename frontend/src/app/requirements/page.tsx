'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { RequirementDoc } from '@/types/requirement';
import { getRequirementsApi } from '@/lib/api';
import {
  Calendar,
  MapPin,
  Briefcase,
  Music2,
  Users,
  Search,
  ArrowLeft,
  Plus,
  Code,
  Loader2,
  AlertTriangle,
  RefreshCw,
  Tag,
  CheckCircle2
} from 'lucide-react';

export default function RequirementsExplorerPage() {
  const [requirements, setRequirements] = useState<RequirementDoc[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [inspectDoc, setInspectDoc] = useState<RequirementDoc | null>(null);

  const fetchRequirements = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getRequirementsApi(selectedCategory, searchQuery);
      setRequirements(res.data);
      setTotalCount(res.total);
    } catch (err: any) {
      setError(err.message || 'Could not connect to the backend server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequirements();
  }, [selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRequirements();
  };

  const formatDate = (dateStr: string) => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 font-serif text-slate-800 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-emerald-100">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Link
                href="/"
                className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-1 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Requirement Wizard</span>
              </Link>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-emerald-900 tracking-tight">
              Requirements Explorer & Feed
            </h1>
            <p className="text-sm text-emerald-700 italic mt-1 font-light">
              Inspect all real-time requirements stored in MongoDB. Filter by category or search.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={fetchRequirements}
              disabled={isLoading}
              className="p-3 rounded-full bg-white border border-emerald-200 hover:bg-emerald-50 text-emerald-700 shadow-sm transition-all cursor-pointer flex-shrink-0"
              title="Refresh feed"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            <Link
              href="/"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all w-full sm:w-auto cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Post New Requirement</span>
            </Link>
          </div>
        </div>

        {/* Search Bar (Screenshot 1 / doctorsPageStyles.searchInput style) */}
        <div className="flex justify-center">
          <form onSubmit={handleSearchSubmit} className="relative w-full max-w-xl">
            <Search className="w-5 h-5 text-emerald-600 absolute left-5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search requirements by event name or city..."
              className="w-full py-4 pl-14 pr-24 text-sm sm:text-base rounded-full border border-emerald-300 bg-white/95 text-emerald-900 placeholder-emerald-400 shadow-md sm:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-400/40 focus:border-emerald-500 transition-all"
            />
            <button
              type="submit"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 px-5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
            >
              Search
            </button>
          </form>
        </div>

        {/* Category Filter Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {[
            { id: 'all', label: 'All Requirements' },
            { id: 'planner', label: 'Event Planners', icon: Briefcase },
            { id: 'performer', label: 'Performers / Artists', icon: Music2 },
            { id: 'crew', label: 'Event Crew Staff', icon: Users }
          ].map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-md border border-emerald-600 ring-2 ring-emerald-200'
                    : 'bg-white border border-emerald-200 text-emerald-800 hover:bg-emerald-50'
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content State */}
        {isLoading ? (
          <div className="py-24 text-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto" />
            <p className="text-sm text-emerald-700 italic">Fetching requirements from MongoDB...</p>
          </div>
        ) : error ? (
          <div className="p-8 rounded-3xl bg-rose-50 border border-rose-200 text-center max-w-md mx-auto space-y-3 shadow-md">
            <AlertTriangle className="w-8 h-8 text-rose-500 mx-auto" />
            <h3 className="text-base font-bold text-rose-950">Connection Error</h3>
            <p className="text-xs text-rose-700 font-sans">{error}</p>
            <button
              type="button"
              onClick={fetchRequirements}
              className="px-5 py-2 rounded-full bg-white border border-rose-200 text-xs font-bold text-rose-800 hover:bg-rose-100/50 cursor-pointer"
            >
              Retry Connection
            </button>
          </div>
        ) : requirements.length === 0 ? (
          <div className="py-20 text-center rounded-3xl bg-white/70 border-2 border-dashed border-emerald-200 space-y-3 max-w-xl mx-auto p-8 shadow-sm">
            <Tag className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="text-lg font-bold text-emerald-950">No Requirements Found</h3>
            <p className="text-xs text-emerald-700 max-w-sm mx-auto italic">
              No requirements match your current filter. Use the wizard to post one!
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-emerald-600 text-white text-xs font-bold shadow-md hover:bg-emerald-700 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Requirement</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requirements.map((req) => (
              <div
                key={req._id}
                className="rounded-3xl bg-white border-2 border-emerald-100 p-6 flex flex-col justify-between hover:border-emerald-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 group shadow-sm"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between mb-3.5">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
                      {req.category === 'planner' && <Briefcase className="w-3.5 h-3.5 text-emerald-700" />}
                      {req.category === 'performer' && <Music2 className="w-3.5 h-3.5 text-emerald-700" />}
                      {req.category === 'crew' && <Users className="w-3.5 h-3.5 text-emerald-700" />}
                      <span>{req.category.toUpperCase()}</span>
                    </span>

                    <span className="text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-semibold">
                      {req.eventType.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-emerald-950 tracking-tight line-clamp-1 group-hover:text-emerald-700 transition-colors">
                    {req.eventName}
                  </h3>

                  {/* Location & Dates */}
                  <div className="mt-2.5 space-y-1 text-xs text-emerald-700">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      <span className="truncate font-medium">{req.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span>
                        {formatDate(req.startDate)}
                        {req.isMultiDay && ` → ${formatDate(req.endDate)}`}
                      </span>
                    </div>
                  </div>

                  {/* Category Snippets */}
                  <div className="mt-4 pt-3.5 border-t border-emerald-100 text-xs text-gray-700 font-sans">
                    {req.category === 'planner' && (
                      <p className="line-clamp-2">
                        <strong className="text-emerald-900 font-serif font-bold">Scale:</strong> {req.categoryDetails?.guestCount} guests •{' '}
                        {req.categoryDetails?.servicesNeeded?.map((s: string) => s.replace('_', ' ')).join(', ')}
                      </p>
                    )}

                    {req.category === 'performer' && (
                      <p className="line-clamp-2">
                        <strong className="text-emerald-900 font-serif font-bold">Act:</strong> {req.categoryDetails?.performanceType?.toUpperCase()} •{' '}
                        {req.categoryDetails?.genreOrStyle} ({req.categoryDetails?.durationMinutes} mins)
                      </p>
                    )}

                    {req.category === 'crew' && (
                      <div className="space-y-1.5">
                        <p className="text-[11px]">
                          <strong className="text-emerald-900 font-serif font-bold">Level:</strong> {req.categoryDetails?.experienceLevel}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {req.categoryDetails?.crewRoles?.slice(0, 3).map((r: any, idx: number) => (
                            <span key={idx} className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] text-emerald-800 font-semibold">
                              {r.role} ({r.count})
                            </span>
                          ))}
                          {(req.categoryDetails?.crewRoles?.length || 0) > 3 && (
                            <span className="text-[10px] text-gray-400">
                              +{req.categoryDetails.crewRoles.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="mt-5 pt-3.5 border-t border-emerald-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-emerald-700 uppercase font-bold">Budget</span>
                    <p className="font-extrabold text-emerald-800 text-base">
                      {req.additionalDetails?.budget
                        ? `₹${req.additionalDetails.budget.toLocaleString('en-IN')}`
                        : req.additionalDetails?.budgetAmount
                        ? `₹${req.additionalDetails.budgetAmount.toLocaleString('en-IN')}`
                        : 'Custom'}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setInspectDoc(req)}
                    className="flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Code className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Raw JSON</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Raw JSON Inspection Modal */}
      {inspectDoc && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border-2 border-emerald-200 rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden font-serif">
            <div className="p-5 border-b border-emerald-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-emerald-950 text-base">MongoDB Document Inspector</h3>
                <p className="text-xs text-emerald-700 font-mono mt-0.5">_id: {inspectDoc._id}</p>
              </div>
              <button
                type="button"
                onClick={() => setInspectDoc(null)}
                className="w-8 h-8 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 flex items-center justify-center cursor-pointer border border-emerald-200"
              >
                ✕
              </button>
            </div>
            <div className="p-5 overflow-y-auto flex-1 bg-emerald-950 font-mono text-xs text-emerald-300">
              <pre>{JSON.stringify(inspectDoc, null, 2)}</pre>
            </div>
            <div className="p-4 border-t border-emerald-100 bg-emerald-50/50 flex justify-end">
              <button
                type="button"
                onClick={() => setInspectDoc(null)}
                className="px-6 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white shadow-sm cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
