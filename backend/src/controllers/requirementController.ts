import { Request, Response, NextFunction } from 'express';
import { Requirement } from '../models/Requirement.js';
import { CreateRequirementSchema } from '../validators/requirementValidator.js';

/**
 * @desc    Create and save a new event requirement
 * @route   POST /api/requirements
 * @access  Public
 */
export async function createRequirement(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // 1. Strict validation via Zod
    const validatedData = CreateRequirementSchema.parse(req.body);

    // 2. Sanitize and structure persistence payload
    const requirement = new Requirement({
      eventName: validatedData.eventName,
      eventType: validatedData.eventType,
      isMultiDay: validatedData.isMultiDay,
      startDate: validatedData.startDate,
      endDate: validatedData.endDate,
      location: validatedData.location,
      venue: validatedData.venue || '',
      category: validatedData.category,
      categoryDetails: validatedData.categoryDetails,
      additionalDetails: validatedData.additionalDetails,
      status: 'open'
    });

    const savedDoc = await requirement.save();

    res.status(201).json({
      success: true,
      message: `Requirement successfully created for category: ${savedDoc.category.toUpperCase()}`,
      data: savedDoc
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Get all requirements with optional category and search filters
 * @route   GET /api/requirements
 * @access  Public
 */
export async function getRequirements(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { category, search, eventType, page = '1', limit = '12' } = req.query;

    const query: Record<string, any> = {};

    if (category && typeof category === 'string' && ['planner', 'performer', 'crew'].includes(category)) {
      query.category = category;
    }

    if (eventType && typeof eventType === 'string') {
      query.eventType = eventType;
    }

    if (search && typeof search === 'string' && search.trim() !== '') {
      query.$or = [
        { eventName: { $regex: search.trim(), $options: 'i' } },
        { location: { $regex: search.trim(), $options: 'i' } },
        { venue: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit as string, 10) || 12));
    const skip = (pageNum - 1) * limitNum;

    const [requirements, total] = await Promise.all([
      Requirement.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Requirement.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      count: requirements.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      data: requirements
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Get single requirement by ID
 * @route   GET /api/requirements/:id
 * @access  Public
 */
export async function getRequirementById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;

    const requirement = await Requirement.findById(id);

    if (!requirement) {
      res.status(404).json({
        success: false,
        message: `Requirement with ID ${id} not found`
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: requirement
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Get aggregated stats (Counts by category)
 * @route   GET /api/requirements/stats
 * @access  Public
 */
export async function getRequirementStats(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const stats = await Requirement.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    const formattedStats: Record<string, number> = {
      total: 0,
      planner: 0,
      performer: 0,
      crew: 0
    };

    stats.forEach((item) => {
      if (item._id in formattedStats) {
        formattedStats[item._id] = item.count;
      }
      formattedStats.total += item.count;
    });

    res.status(200).json({
      success: true,
      data: formattedStats
    });
  } catch (error) {
    next(error);
  }
}
