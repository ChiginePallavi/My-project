import express from 'express';
import {
  getCompanyController,
  getCompanyByIdController,
  createCompanyController,
  updateCompanyController,
  deleteCompanyController,
} from '../controllers/companyController.js';

const router = express.Router();

router.get('/', getCompanyController);
router.get('/:id', getCompanyByIdController);
router.post('/', createCompanyController);
router.put('/:id', updateCompanyController);
router.delete('/:id', deleteCompanyController);

export default router;
