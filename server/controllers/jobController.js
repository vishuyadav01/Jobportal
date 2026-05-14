import Job from '../models/Job.js';
import asyncHandler from '../middleware/asyncHandler.js';

// @desc    Get all jobs with filters and search
// @route   GET /api/jobs
export const getJobs = asyncHandler(async (req, res) => {
  const { keyword, location, jobType, experienceLevel, salaryMin, pageNumber } = req.query;

  const pageSize = 12;
  const page = Number(pageNumber) || 1;

  const query = {};

  if (keyword) {
    query.$or = [
      { title: { $regex: keyword, $options: 'i' } },
      { company: { $regex: keyword, $options: 'i' } },
      { description: { $regex: keyword, $options: 'i' } },
    ];
  }

  if (location) query.location = { $regex: location, $options: 'i' };
  if (jobType) query.jobType = jobType;
  if (experienceLevel) query.experienceLevel = experienceLevel;
  if (salaryMin) query.salary = { $gte: Number(salaryMin) };

  const count = await Job.countDocuments(query);
  const jobs = await Job.find(query)
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .populate('recruiterId', 'name email');

  res.json({ jobs, page, pages: Math.ceil(count / pageSize), total: count });
});

// @desc    Get latest 6 jobs for homepage
// @route   GET /api/jobs/latest
export const getLatestJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({}).sort({ createdAt: -1 }).limit(6);
  res.json(jobs);
});

// @desc    Get job by ID
// @route   GET /api/jobs/:id
export const getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id).populate('recruiterId', 'name email');
  if (job) {
    res.json(job);
  } else {
    res.status(404);
    throw new Error('Job not found');
  }
});

// @desc    Create a job (Recruiter only)
export const createJob = asyncHandler(async (req, res) => {
  const { title, company, location, salary, jobType, experienceLevel, description, skillsRequired } = req.body;

  const job = new Job({
    title,
    company,
    location,
    salary,
    jobType,
    experienceLevel,
    description,
    skillsRequired,
    recruiterId: req.user._id,
  });

  const createdJob = await job.save();
  res.status(201).json(createdJob);
});

// @desc    Update a job
export const updateJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (job) {
    if (job.recruiterId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this job');
    }

    job.title = req.body.title || job.title;
    job.company = req.body.company || job.company;
    job.location = req.body.location || job.location;
    job.salary = req.body.salary || job.salary;
    job.jobType = req.body.jobType || job.jobType;
    job.experienceLevel = req.body.experienceLevel || job.experienceLevel;
    job.description = req.body.description || job.description;
    job.skillsRequired = req.body.skillsRequired || job.skillsRequired;

    const updatedJob = await job.save();
    res.json(updatedJob);
  } else {
    res.status(404);
    throw new Error('Job not found');
  }
});

// @desc    Delete a job
export const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (job) {
    if (job.recruiterId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to delete this job');
    }
    await job.deleteOne();
    res.json({ message: 'Job removed' });
  } else {
    res.status(404);
    throw new Error('Job not found');
  }
});

// @desc    Get recruiter's jobs
export const getMyJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ recruiterId: req.user._id }).sort({ createdAt: -1 });
  res.json(jobs);
});
