import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    salary: { type: Number },
    jobType: { type: String, enum: ['full-time', 'part-time', 'internship', 'contract'], default: 'full-time' },
    experienceLevel: { type: String, enum: ['fresher', 'junior', 'mid', 'senior'], default: 'fresher' },
    description: { type: String, required: true },
    skillsRequired: [String],
    recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const Job = mongoose.model('Job', jobSchema);
export default Job;
