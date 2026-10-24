import { Router } from 'express';
import {
  createRequirement,
  getRequirements,
  getRequirementById,
  getRequirementStats
} from '../controllers/requirementController.js';

const router = Router();

// Stats route must precede /:id to prevent routing conflict
router.get('/stats', getRequirementStats);

// Main collection routes
router.route('/')
  .post(createRequirement)
  .get(getRequirements);

// Document specific route
router.route('/:id')
  .get(getRequirementById);

export default router;
