import express from 'express';
import {
  getAllOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
  searchOpportunities
} from '../controllers/opportunityController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllOpportunities);
router.get('/search', searchOpportunities);
router.get('/:id', getOpportunityById);

// Protected Admin APIs (RBAC)
router.post('/', protect, authorizeRoles('admin'), createOpportunity);
router.put('/:id', protect, authorizeRoles('admin'), updateOpportunity);
router.delete('/:id', protect, authorizeRoles('admin'), deleteOpportunity);

export default router;
