import { Schema, model, Document, Types } from 'mongoose';

export type EventCategory = 'planner' | 'performer' | 'crew';
export type EventType = 'wedding' | 'corporate' | 'concert' | 'private_party' | 'festival' | 'other';

// Category details interfaces
export interface IPlannerCategoryDetails {
  guestCount: '< 100' | '100 - 300' | '300 - 800' | '800+';
  servicesNeeded: string[];
  themeOrVision?: string;
}

export interface IPerformerCategoryDetails {
  performanceType: 'live_band' | 'dj' | 'solo_instrumentalist' | 'singer' | 'dancer' | 'magician_standup' | 'mc_host' | 'other';
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

// Additional details interfaces
export interface IPlannerAdditionalDetails {
  budget: number;
  cateringCoordination: boolean;
  additionalNotes?: string;
}

export interface IPerformerAdditionalDetails {
  budget: number;
  soundSystemProvided: boolean;
  technicalRider?: string;
  hospitalityNotes?: string;
}

export interface ICrewAdditionalDetails {
  budgetType: 'hourly_rate' | 'flat_daily_rate';
  budgetAmount: number;
  shiftStartTime: string;
  shiftDurationHours: number;
  specialInstructions?: string;
}

// Full Requirement Document Interface
export interface IRequirement extends Document {
  _id: Types.ObjectId;
  eventName: string;
  eventType: EventType;
  isMultiDay: boolean;
  startDate: Date;
  endDate: Date;
  location: string;
  venue?: string;
  category: EventCategory;
  categoryDetails: IPlannerCategoryDetails | IPerformerCategoryDetails | ICrewCategoryDetails | Record<string, any>;
  additionalDetails: IPlannerAdditionalDetails | IPerformerAdditionalDetails | ICrewAdditionalDetails | Record<string, any>;
  status: 'open' | 'in_review' | 'fulfilled' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

const CrewRoleSubSchema = new Schema(
  {
    role: { type: String, required: true, trim: true },
    count: { type: Number, required: true, min: 1, default: 1 }
  },
  { _id: false }
);

const RequirementSchema = new Schema<IRequirement>(
  {
    eventName: {
      type: String,
      required: [true, 'Event name is required'],
      trim: true,
      minlength: [3, 'Event name must be at least 3 characters'],
      maxlength: [120, 'Event name cannot exceed 120 characters'],
      index: true
    },
    eventType: {
      type: String,
      required: [true, 'Event type is required'],
      enum: {
        values: ['wedding', 'corporate', 'concert', 'private_party', 'festival', 'other'],
        message: '{VALUE} is not a valid event type'
      }
    },
    isMultiDay: {
      type: Boolean,
      default: false
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required']
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required']
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true
    },
    venue: {
      type: String,
      trim: true,
      default: ''
    },
    category: {
      type: String,
      required: [true, 'Requirement category is required'],
      enum: {
        values: ['planner', 'performer', 'crew'],
        message: '{VALUE} must be either planner, performer, or crew'
      },
      index: true
    },
    categoryDetails: {
      type: Schema.Types.Mixed,
      required: [true, 'Category specific details are required']
    },
    additionalDetails: {
      type: Schema.Types.Mixed,
      required: [true, 'Additional details and logistics are required']
    },
    status: {
      type: String,
      enum: ['open', 'in_review', 'fulfilled', 'closed'],
      default: 'open',
      index: true
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: Record<string, any>) => {
        ret.id = ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Compound index for querying recent requirements by category
RequirementSchema.index({ category: 1, createdAt: -1 });

export const Requirement = model<IRequirement>('Requirement', RequirementSchema);
