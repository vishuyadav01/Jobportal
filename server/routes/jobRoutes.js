import express from 'express';
import { getJobs, getJobById, createJob, updateJob, deleteJob, getMyJobs, getLatestJobs } from '../controllers/jobController.js';
import { protect, recruiter } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getJobs);
router.get('/latest', getLatestJobs);
router.post('/', protect, recruiter, createJob);
router.get('/my-jobs', protect, recruiter, getMyJobs);
router.get('/:id', getJobById);
router.put('/:id', protect, recruiter, updateJob);
router.delete('/:id', protect, recruiter, deleteJob);

export default router;
