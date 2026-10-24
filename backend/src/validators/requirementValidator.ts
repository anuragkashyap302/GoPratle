import { z } from 'zod';

// Base Event Basics Schema
const EventBasicsSchema = z.object({
  eventName: z.string().trim().min(3, 'Event name must be at least 3 characters').max(120, 'Event name cannot exceed 120 characters'),
  eventType: z.enum(['wedding', 'corporate', 'concert', 'private_party', 'festival', 'other'], {
    errorMap: () => ({ message: 'Please select a valid event type' })
  }),
  isMultiDay: z.boolean().default(false),
  startDate: z.coerce.date({ invalid_type_error: 'Please enter a valid start date' }),
  endDate: z.coerce.date({ invalid_type_error: 'Please enter a valid end date' }),
  location: z.string().trim().min(2, 'Location is required (min 2 characters)'),
  venue: z.string().trim().optional().default(''),
  category: z.enum(['planner', 'performer', 'crew'], {
    errorMap: () => ({ message: 'Category must be planner, performer, or crew' })
  })
});

// Category Specific: Planner
export const PlannerCategoryDetailsSchema = z.object({
  guestCount: z.enum(['< 100', '100 - 300', '300 - 800', '800+'], {
    errorMap: () => ({ message: 'Please select an estimated guest scale' })
  }),
  servicesNeeded: z.array(z.string()).min(1, 'Select at least one planning service needed'),
  themeOrVision: z.string().trim().optional()
});

export const PlannerAdditionalDetailsSchema = z.object({
  budget: z.coerce.number().min(1000, 'Estimated budget must be at least ₹1,000'),
  cateringCoordination: z.boolean().default(false),
  additionalNotes: z.string().trim().optional()
});

// Category Specific: Performer
export const PerformerCategoryDetailsSchema = z.object({
  performanceType: z.enum([
    'live_band',
    'dj',
    'solo_instrumentalist',
    'singer',
    'dancer',
    'magician_standup',
    'mc_host',
    'other'
  ], {
    errorMap: () => ({ message: 'Please select a performance type' })
  }),
  genreOrStyle: z.string().trim().min(2, 'Genre / style is required (e.g., Bollywood, Acoustic, EDM)'),
  durationMinutes: z.coerce.number().min(15, 'Performance set must be at least 15 minutes').max(480, 'Performance set cannot exceed 480 minutes (8 hours)'),
  performerCount: z.coerce.number().min(1, 'Performer count must be at least 1')
});

export const PerformerAdditionalDetailsSchema = z.object({
  budget: z.coerce.number().min(500, 'Budget must be at least ₹500'),
  soundSystemProvided: z.boolean().default(false),
  technicalRider: z.string().trim().optional(),
  hospitalityNotes: z.string().trim().optional()
});

// Category Specific: Crew
export const CrewRoleItemSchema = z.object({
  role: z.string().trim().min(2, 'Role title is required'),
  count: z.coerce.number().min(1, 'Count must be at least 1')
});

export const CrewCategoryDetailsSchema = z.object({
  crewRoles: z.array(CrewRoleItemSchema).min(1, 'Specify at least one crew role required'),
  experienceLevel: z.enum(['entry', 'experienced', 'expert'], {
    errorMap: () => ({ message: 'Please select an experience level' })
  }),
  equipmentHandling: z.enum(['crew_brings_gear', 'venue_provides_gear', 'mixed_rental'], {
    errorMap: () => ({ message: 'Please select equipment arrangement' })
  })
});

export const CrewAdditionalDetailsSchema = z.object({
  budgetType: z.enum(['hourly_rate', 'flat_daily_rate'], {
    errorMap: () => ({ message: 'Budget type must be hourly rate or flat daily rate' })
  }),
  budgetAmount: z.coerce.number().min(200, 'Rate / budget must be at least ₹200'),
  shiftStartTime: z.string().trim().min(1, 'Shift start time is required'),
  shiftDurationHours: z.coerce.number().min(1, 'Shift duration must be at least 1 hour').max(24, 'Shift duration cannot exceed 24 hours'),
  specialInstructions: z.string().trim().optional()
});

// Discriminated / Unified Validation Schema
export const CreateRequirementSchema = EventBasicsSchema.extend({
  categoryDetails: z.record(z.any()),
  additionalDetails: z.record(z.any())
})
  .superRefine((data, ctx) => {
    // 1. Validate date logic
    if (data.endDate < data.startDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['endDate'],
        message: 'End date cannot be earlier than start date'
      });
    }

    // 2. Validate category details based on selected category
    if (data.category === 'planner') {
      const catResult = PlannerCategoryDetailsSchema.safeParse(data.categoryDetails);
      if (!catResult.success) {
        catResult.error.issues.forEach((issue) => {
          ctx.addIssue({
            ...issue,
            path: ['categoryDetails', ...issue.path]
          });
        });
      }

      const addResult = PlannerAdditionalDetailsSchema.safeParse(data.additionalDetails);
      if (!addResult.success) {
        addResult.error.issues.forEach((issue) => {
          ctx.addIssue({
            ...issue,
            path: ['additionalDetails', ...issue.path]
          });
        });
      }
    } else if (data.category === 'performer') {
      const catResult = PerformerCategoryDetailsSchema.safeParse(data.categoryDetails);
      if (!catResult.success) {
        catResult.error.issues.forEach((issue) => {
          ctx.addIssue({
            ...issue,
            path: ['categoryDetails', ...issue.path]
          });
        });
      }

      const addResult = PerformerAdditionalDetailsSchema.safeParse(data.additionalDetails);
      if (!addResult.success) {
        addResult.error.issues.forEach((issue) => {
          ctx.addIssue({
            ...issue,
            path: ['additionalDetails', ...issue.path]
          });
        });
      }
    } else if (data.category === 'crew') {
      const catResult = CrewCategoryDetailsSchema.safeParse(data.categoryDetails);
      if (!catResult.success) {
        catResult.error.issues.forEach((issue) => {
          ctx.addIssue({
            ...issue,
            path: ['categoryDetails', ...issue.path]
          });
        });
      }

      const addResult = CrewAdditionalDetailsSchema.safeParse(data.additionalDetails);
      if (!addResult.success) {
        addResult.error.issues.forEach((issue) => {
          ctx.addIssue({
            ...issue,
            path: ['additionalDetails', ...issue.path]
          });
        });
      }
    }
  });

export type CreateRequirementInput = z.infer<typeof CreateRequirementSchema>;
