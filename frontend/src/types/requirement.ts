export type EventCategory = 'planner' | 'performer' | 'crew';

export type EventType =
  | 'wedding'
  | 'corporate'
  | 'concert'
  | 'private_party'
  | 'festival'
  | 'other';

export interface IPlannerCategoryDetails {
  guestCount: '< 100' | '100 - 300' | '300 - 800' | '800+';
  servicesNeeded: string[];
  themeOrVision: string;
}

export interface IPerformerCategoryDetails {
  performanceType:
    | 'live_band'
    | 'dj'
    | 'solo_instrumentalist'
    | 'singer'
    | 'dancer'
    | 'magician_standup'
    | 'mc_host'
    | 'other';
  genreOrStyle: string;
  durationMinutes: number;
  performerCount: number;
}

export interface ICrewRoleItem {
  role: string;
  count: number;
}

export interface ICrewCategoryDetails {
  crewRoles: ICrewRoleItem[];
  experienceLevel: 'entry' | 'experienced' | 'expert';
  equipmentHandling: 'crew_brings_gear' | 'venue_provides_gear' | 'mixed_rental';
}

export interface IPlannerAdditionalDetails {
  budget: number;
  cateringCoordination: boolean;
  additionalNotes: string;
}

export interface IPerformerAdditionalDetails {
  budget: number;
  soundSystemProvided: boolean;
  technicalRider: string;
  hospitalityNotes: string;
}

export interface ICrewAdditionalDetails {
  budgetType: 'hourly_rate' | 'flat_daily_rate';
  budgetAmount: number;
  shiftStartTime: string;
  shiftDurationHours: number;
  specialInstructions: string;
}

export interface RequirementFormData {
  // Step 1: Universal
  eventName: string;
  eventType: EventType;
  isMultiDay: boolean;
  startDate: string;
  endDate: string;
  location: string;
  venue: string;
  category: EventCategory;

  // Step 2 & 3: Category-specific
  plannerCategoryDetails: IPlannerCategoryDetails;
  plannerAdditionalDetails: IPlannerAdditionalDetails;

  performerCategoryDetails: IPerformerCategoryDetails;
  performerAdditionalDetails: IPerformerAdditionalDetails;

  crewCategoryDetails: ICrewCategoryDetails;
  crewAdditionalDetails: ICrewAdditionalDetails;
}

export interface RequirementDoc {
  _id: string;
  eventName: string;
  eventType: EventType;
  isMultiDay: boolean;
  startDate: string;
  endDate: string;
  location: string;
  venue?: string;
  category: EventCategory;
  categoryDetails: any;
  additionalDetails: any;
  status: 'open' | 'in_review' | 'fulfilled' | 'closed';
  createdAt: string;
  updatedAt: string;
}
