import express from 'express';
import {
  getAllOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
  searchOpportunities
} from '../controllers/opportunityController.js';

const router = express.Router();

router.get('/search', searchOpportunities);
router.get('/', getAllOpportunities);
router.get('/:id', getOpportunityById);
router.post('/', createOpportunity);
router.put('/:id', updateOpportunity);
router.delete('/:id', deleteOpportunity);

export default router;
