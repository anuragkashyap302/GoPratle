'use client';

import { useState, useEffect, useCallback } from 'react';
import { RequirementFormData, EventCategory, RequirementDoc } from '@/types/requirement';
import { INITIAL_FORM_DATA, getSampleDataForCategory } from '@/lib/constants';
import { createRequirementApi } from '@/lib/api';

const STORAGE_KEY = 'gopratle_wizard_draft_v1';

export function useRequirementWizard() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<RequirementFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitResult, setSubmitResult] = useState<RequirementDoc | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [hasLoadedDraft, setHasLoadedDraft] = useState<boolean>(false);

  // Load draft from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setFormData((prev) => ({
          ...prev,
          ...parsed
        }));
      }
    } catch (e) {
      console.warn('Failed to parse saved draft from localStorage:', e);
    } finally {
      setHasLoadedDraft(true);
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (!hasLoadedDraft) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    } catch (e) {
      console.warn('Failed to save draft to localStorage:', e);
    }
  }, [formData, hasLoadedDraft]);

  // Update top-level event fields
  const updateField = useCallback(<K extends keyof RequirementFormData>(key: K, value: RequirementFormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (prev[key]) {
        const next = { ...prev };
        delete next[key];
        return next;
      }
      return prev;
    });
  }, []);

  // Update category-specific details
  const updateCategoryDetails = useCallback((field: string, value: any) => {
    setFormData((prev) => {
      const cat = prev.category;
      if (cat === 'planner') {
        return {
          ...prev,
          plannerCategoryDetails: { ...prev.plannerCategoryDetails, [field]: value }
        };
      } else if (cat === 'performer') {
        return {
          ...prev,
          performerCategoryDetails: { ...prev.performerCategoryDetails, [field]: value }
        };
      } else {
        return {
          ...prev,
          crewCategoryDetails: { ...prev.crewCategoryDetails, [field]: value }
        };
      }
    });

    setErrors((prev) => {
      if (prev[field]) {
        const next = { ...prev };
        delete next[field];
        return next;
      }
      return prev;
    });
  }, []);

  // Update additional/logistics details
  const updateAdditionalDetails = useCallback((field: string, value: any) => {
    setFormData((prev) => {
      const cat = prev.category;
      if (cat === 'planner') {
        return {
          ...prev,
          plannerAdditionalDetails: { ...prev.plannerAdditionalDetails, [field]: value }
        };
      } else if (cat === 'performer') {
        return {
          ...prev,
          performerAdditionalDetails: { ...prev.performerAdditionalDetails, [field]: value }
        };
      } else {
        return {
          ...prev,
          crewAdditionalDetails: { ...prev.crewAdditionalDetails, [field]: value }
        };
      }
    });

    setErrors((prev) => {
      if (prev[field]) {
        const next = { ...prev };
        delete next[field];
        return next;
      }
      return prev;
    });
  }, []);

  // Set category cleanly
  const setCategory = useCallback((category: EventCategory) => {
    setFormData((prev) => ({
      ...prev,
      category
    }));
  }, []);

  // Quick fill sample data for testing/demo
  const fillSampleData = useCallback(() => {
    const sample = getSampleDataForCategory(formData.category);
    setFormData((prev) => ({
      ...prev,
      ...sample
    }));
    setErrors({});
  }, [formData.category]);

  // Reset entire form and local draft
  const resetForm = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setFormData(INITIAL_FORM_DATA);
    setErrors({});
    setCurrentStep(1);
    setSubmitResult(null);
    setApiError(null);
  }, []);

  // Step-by-step validator
  const validateStep = useCallback((step: number): boolean => {
    const stepErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.eventName || formData.eventName.trim().length < 3) {
        stepErrors.eventName = 'Event name must be at least 3 characters.';
      }
      if (!formData.location || formData.location.trim().length < 2) {
        stepErrors.location = 'Please enter a valid city or location.';
      }
      if (!formData.startDate) {
        stepErrors.startDate = 'Start date is required.';
      }
      if (formData.isMultiDay) {
        if (!formData.endDate) {
          stepErrors.endDate = 'End date is required for multi-day events.';
        } else if (new Date(formData.endDate) < new Date(formData.startDate)) {
          stepErrors.endDate = 'End date cannot be earlier than start date.';
        }
      }
    } else if (step === 2) {
      const cat = formData.category;
      if (cat === 'planner') {
        if (!formData.plannerCategoryDetails.servicesNeeded || formData.plannerCategoryDetails.servicesNeeded.length === 0) {
          stepErrors.servicesNeeded = 'Please select at least one planning service.';
        }
      } else if (cat === 'performer') {
        if (!formData.performerCategoryDetails.genreOrStyle || formData.performerCategoryDetails.genreOrStyle.trim().length < 2) {
          stepErrors.genreOrStyle = 'Genre or performance style is required.';
        }
        if (!formData.performerCategoryDetails.durationMinutes || formData.performerCategoryDetails.durationMinutes < 15) {
          stepErrors.durationMinutes = 'Duration must be at least 15 minutes.';
        }
      } else if (cat === 'crew') {
        if (!formData.crewCategoryDetails.crewRoles || formData.crewCategoryDetails.crewRoles.length === 0) {
          stepErrors.crewRoles = 'Please add at least one crew role with head count.';
        }
      }
    } else if (step === 3) {
      const cat = formData.category;
      if (cat === 'planner') {
        if (!formData.plannerAdditionalDetails.budget || formData.plannerAdditionalDetails.budget < 1000) {
          stepErrors.budget = 'Please enter an estimated budget (min ₹1,000).';
        }
      } else if (cat === 'performer') {
        if (!formData.performerAdditionalDetails.budget || formData.performerAdditionalDetails.budget < 500) {
          stepErrors.budget = 'Please specify artist fee budget (min ₹500).';
        }
      } else if (cat === 'crew') {
        if (!formData.crewAdditionalDetails.budgetAmount || formData.crewAdditionalDetails.budgetAmount < 200) {
          stepErrors.budgetAmount = 'Please enter crew compensation rate (min ₹200).';
        }
        if (!formData.crewAdditionalDetails.shiftStartTime) {
          stepErrors.shiftStartTime = 'Please specify shift call time.';
        }
      }
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  }, [formData]);

  // Step Navigation
  const nextStep = useCallback(() => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(4, prev + 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep, validateStep]);

  const prevStep = useCallback(() => {
    setErrors({});
    setCurrentStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const goToStep = useCallback((step: number) => {
    setErrors({});
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Submit flow
  const submitRequirement = useCallback(async () => {
    // Validate all 3 steps before final post
    const s1 = validateStep(1);
    const s2 = validateStep(2);
    const s3 = validateStep(3);

    if (!s1 || !s2 || !s3) {
      setApiError('Please review and correct the highlighted fields before submitting.');
      return;
    }

    setIsSubmitting(true);
    setApiError(null);

    try {
      const result = await createRequirementApi(formData);
      setSubmitResult(result);
      localStorage.removeItem(STORAGE_KEY);
    } catch (err: any) {
      setApiError(err.message || 'An unexpected error occurred while saving the requirement.');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateStep]);

  return {
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
  };
}
