import express from 'express';
import { applyToJob, getMyApplications, getJobApplicants, updateApplicationStatus } from '../controllers/applicationController.js';
import { protect, recruiter } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/apply/:jobId', protect, applyToJob);
router.get('/my-applications', protect, getMyApplications);
router.get('/applicants/:jobId', protect, recruiter, getJobApplicants);
router.put('/status/:id', protect, recruiter, updateApplicationStatus);

export default router;
