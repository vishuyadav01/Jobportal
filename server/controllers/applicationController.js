import Application from '../models/Application.js';
import Job from '../models/Job.js';
import asyncHandler from '../middleware/asyncHandler.js';

// @desc    Apply for a job
// @route   POST /api/applications/apply/:jobId
export const applyToJob = asyncHandler(async (req, res) => {
  const jobId = req.params.jobId;
  const candidateId = req.user._id;

  // Check if job exists
  const job = await Job.findById(jobId);
  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  // Check for duplicate application
  const alreadyApplied = await Application.findOne({ jobId, candidateId });
  if (alreadyApplied) {
    res.status(400);
    throw new Error('You have already applied for this job');
  }

  const application = new Application({
    jobId,
    candidateId,
  });

  await application.save();
  res.status(201).json({ message: 'Applied successfully', application });
});

// @desc    Get candidate's applications
export const getMyApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({ candidateId: req.user._id })
    .populate('jobId')
    .sort({ createdAt: -1 });
  res.json(applications);
});

// @desc    Get all applicants for a recruiter's job
export const getJobApplicants = asyncHandler(async (req, res) => {
  const { jobId } = req.params;

  const job = await Job.findById(jobId);
  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  if (job.recruiterId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to view applicants for this job');
  }

  const applicants = await Application.find({ jobId })
    .populate('candidateId', 'name email phone resumeUrl skills')
    .sort({ createdAt: -1 });

  res.json(applicants);
});

// @desc    Update application status (Accept/Reject)
export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const application = await Application.findById(req.params.id).populate('jobId');

  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }

  // Check if recruiter is authorized
  if (application.jobId.recruiterId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this application');
  }

  // Prevent updating if already accepted/rejected
  if (application.status !== 'pending') {
    res.status(400);
    throw new Error(`Application already ${application.status}`);
  }

  application.status = status;
  await application.save();

  res.json({ message: `Application ${status}`, application });
});
