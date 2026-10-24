import { RequirementFormData, EventCategory } from '@/types/requirement';

export const INITIAL_FORM_DATA: RequirementFormData = {
  // Step 1
  eventName: '',
  eventType: 'wedding',
  isMultiDay: false,
  startDate: '',
  endDate: '',
  location: '',
  venue: '',
  category: 'planner',

  // Step 2 & 3: Planner
  plannerCategoryDetails: {
    guestCount: '100 - 300',
    servicesNeeded: ['full_planning', 'decor_styling'],
    themeOrVision: ''
  },
  plannerAdditionalDetails: {
    budget: 250000,
    cateringCoordination: true,
    additionalNotes: ''
  },

  // Step 2 & 3: Performer
  performerCategoryDetails: {
    performanceType: 'dj',
    genreOrStyle: 'Bollywood & Commercial Pop',
    durationMinutes: 90,
    performerCount: 1
  },
  performerAdditionalDetails: {
    budget: 40000,
    soundSystemProvided: true,
    technicalRider: 'Pioneer CDJ console, wireless mic, stage monitor',
    hospitalityNotes: 'Green room access and evening refreshments'
  },

  // Step 2 & 3: Crew
  crewCategoryDetails: {
    crewRoles: [
      { role: 'Camera & Videographer', count: 2 },
      { role: 'Sound Engineer', count: 1 }
    ],
    experienceLevel: 'experienced',
    equipmentHandling: 'venue_provides_gear'
  },
  crewAdditionalDetails: {
    budgetType: 'flat_daily_rate',
    budgetAmount: 15000,
    shiftStartTime: '10:00',
    shiftDurationHours: 8,
    specialInstructions: 'All-black professional crew attire. Report to production manager.'
  }
};

export const CATEGORY_META: Record<
  EventCategory,
  {
    title: string;
    subtitle: string;
    badge: string;
    description: string;
  }
> = {
  planner: {
    title: 'Event Planner',
    subtitle: 'End-to-end planning, styling & day-of coordination',
    badge: 'Planning & Styling',
    description: 'Find experienced planners to manage guest scale, decor, and day-of execution.'
  },
  performer: {
    title: 'Performer / Artist',
    subtitle: 'Live Bands, DJs, Soloists & Entertainment',
    badge: 'Live Entertainment',
    description: 'Book talented artists and performers for stage presence and guest engagement.'
  },
  crew: {
    title: 'Event Crew & Staff',
    subtitle: 'AV techs, Videographers, Stagehands & Security',
    badge: 'Technical & On-Ground',
    description: 'Hire skilled technical, operational, and on-ground production crew.'
  }
};

export function getSampleDataForCategory(category: EventCategory): Partial<RequirementFormData> {
  const tomorrow = new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0];
  const nextDay = new Date(Date.now() + 86400000 * 8).toISOString().split('T')[0];

  switch (category) {
    case 'planner':
      return {
        eventName: 'Royal Heritage Palace Gala & Reception',
        eventType: 'wedding',
        isMultiDay: true,
        startDate: tomorrow,
        endDate: nextDay,
        location: 'Jaipur, Rajasthan',
        venue: 'Jai Mahal Palace Lawn',
        category: 'planner',
        plannerCategoryDetails: {
          guestCount: '300 - 800',
          servicesNeeded: ['full_planning', 'decor_styling', 'vendor_management'],
          themeOrVision: 'Imperial Rajasthani royal heritage with marigold chandeliers, mirrorwork accents, and warm ambient illumination.'
        },
        plannerAdditionalDetails: {
          budget: 1200000,
          cateringCoordination: true,
          additionalNotes: 'Need vintage car royal procession and hospitality desks for 250 out-of-town guests.'
        }
      };

    case 'performer':
      return {
        eventName: 'Neon Horizons Campus Music Fest',
        eventType: 'concert',
        isMultiDay: false,
        startDate: tomorrow,
        endDate: tomorrow,
        location: 'Bengaluru, Karnataka',
        venue: 'Manpho Convention Center Open Grounds',
        category: 'performer',
        performerCategoryDetails: {
          performanceType: 'dj',
          genreOrStyle: 'Melodic Techno & High-Energy EDM',
          durationMinutes: 120,
          performerCount: 2
        },
        performerAdditionalDetails: {
          budget: 75000,
          soundSystemProvided: true,
          technicalRider: 'Pioneer CDJ-3000 x 3, DJM-900NXS2 mixer, 2 x 15" booth monitors, smoke cannons.',
          hospitalityNotes: 'Airport drop/pickup in SUV, air-conditioned green room with electrolyte drinks.'
        }
      };

    case 'crew':
      return {
        eventName: 'NextGen Global AI Summit 2027',
        eventType: 'corporate',
        isMultiDay: true,
        startDate: tomorrow,
        endDate: nextDay,
        location: 'Hyderabad, Telangana',
        venue: 'HICC Convention Center Auditorium Hall',
        category: 'crew',
        crewCategoryDetails: {
          crewRoles: [
            { role: 'Sound & Audio Engineer', count: 2 },
            { role: '4K Multi-cam Videographers', count: 3 },
            { role: 'Stage Lighting Technician', count: 2 },
            { role: 'Guest Registration Ushers', count: 4 }
          ],
          experienceLevel: 'experienced',
          equipmentHandling: 'venue_provides_gear'
        },
        crewAdditionalDetails: {
          budgetType: 'flat_daily_rate',
          budgetAmount: 55000,
          shiftStartTime: '08:00',
          shiftDurationHours: 10,
          specialInstructions: 'All crew must wear crisp black business casuals. Strict adherence to schedule.'
        }
      };
  }
}
