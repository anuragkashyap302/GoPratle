import { RequirementFormData, RequirementDoc } from '@/types/requirement';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Array<{ field: string; message: string }>;
}

export async function createRequirementApi(
  formData: RequirementFormData
): Promise<RequirementDoc> {
  // Extract strictly the matching category fields to avoid leaking stale fields
  let categoryDetails: any = {};
  let additionalDetails: any = {};

  if (formData.category === 'planner') {
    categoryDetails = formData.plannerCategoryDetails;
    additionalDetails = formData.plannerAdditionalDetails;
  } else if (formData.category === 'performer') {
    categoryDetails = formData.performerCategoryDetails;
    additionalDetails = formData.performerAdditionalDetails;
  } else if (formData.category === 'crew') {
    categoryDetails = formData.crewCategoryDetails;
    additionalDetails = formData.crewAdditionalDetails;
  }

  const payload = {
    eventName: formData.eventName,
    eventType: formData.eventType,
    isMultiDay: formData.isMultiDay,
    startDate: formData.startDate,
    endDate: formData.isMultiDay ? formData.endDate : formData.startDate,
    location: formData.location,
    venue: formData.venue,
    category: formData.category,
    categoryDetails,
    additionalDetails
  };

  try {
    const res = await fetch(`${API_BASE}/requirements`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data: ApiResponse<RequirementDoc> = await res.json();

    if (!res.ok || !data.success) {
      if (data.errors && data.errors.length > 0) {
        const errorMessages = data.errors.map((e) => `• ${e.field}: ${e.message}`).join('\n');
        throw new Error(`Validation Error:\n${errorMessages}`);
      }
      throw new Error(data.message || `Failed to submit requirement (HTTP ${res.status})`);
    }

    if (!data.data) {
      throw new Error('Server returned an empty response document');
    }

    return data.data;
  } catch (error: any) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error(
        `Unable to reach backend server at ${API_BASE}. Please ensure the Node.js Express server is running on port 5000.`
      );
    }
    throw error;
  }
}

export async function getRequirementsApi(
  category?: string,
  search?: string,
  sortBy: 'newest' | 'oldest' = 'newest'
): Promise<{ total: number; data: RequirementDoc[] }> {
  try {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('category', category);
    if (search && search.trim() !== '') params.append('search', search.trim());
    if (sortBy) params.append('sort', sortBy);

    const res = await fetch(`${API_BASE}/requirements?${params.toString()}`, {
      cache: 'no-store'
    });

    if (!res.ok) {
      throw new Error(`Failed to load requirements list (HTTP ${res.status})`);
    }

    const json = await res.json();
    return {
      total: json.total || 0,
      data: json.data || []
    };
  } catch (error: any) {
    console.error('Fetch error:', error);
    throw error;
  }
}

export async function getRequirementByIdApi(id: string): Promise<RequirementDoc> {
  const res = await fetch(`${API_BASE}/requirements/${id}`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Requirement with ID "${id}" could not be retrieved`);
  }
  const json = await res.json();
  return json.data;
}

export async function checkBackendHealth(): Promise<{ connected: boolean; uptime?: number }> {
  try {
    const res = await fetch(`${API_BASE}/health`, { cache: 'no-store' });
    if (!res.ok) return { connected: false };
    const json = await res.json();
    return { connected: json.database?.connected ?? true, uptime: json.uptime };
  } catch {
    return { connected: false };
  }
}
