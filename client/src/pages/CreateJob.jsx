import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createJob, updateJob, getJobById, resetJobState } from '../features/jobs/jobSlice';
import Sidebar from '../components/Sidebar';
import { FiBriefcase, FiMapPin, FiDollarSign, FiClock, FiPlus, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

const CreateJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { job, isSuccess, isError, message, isLoading } = useSelector((state) => state.jobs);
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    jobType: 'full-time',
    experienceLevel: 'fresher',
    description: '',
    skillsRequired: [],
  });

  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    if (isEditMode) {
      dispatch(getJobById(id));
    } else {
      setFormData({
        title: '',
        company: '',
        location: '',
        salary: '',
        jobType: 'full-time',
        experienceLevel: 'fresher',
        description: '',
        skillsRequired: [],
      });
    }
    return () => dispatch(resetJobState());
  }, [id, isEditMode, dispatch]);

  useEffect(() => {
    if (isEditMode && job) {
      setFormData({
        title: job.title || '',
        company: job.company || '',
        location: job.location || '',
        salary: job.salary || '',
        jobType: job.jobType || 'full-time',
        experienceLevel: job.experienceLevel || 'fresher',
        description: job.description || '',
        skillsRequired: job.skillsRequired || [],
      });
    }
  }, [job, isEditMode]);

  useEffect(() => {
    if (isSuccess && !isLoading) {
      toast.success(isEditMode ? 'Job updated!' : 'Job posted!');
      navigate('/recruiter/dashboard');
      dispatch(resetJobState());
    }
    if (isError) {
      toast.error(message);
      dispatch(resetJobState());
    }
  }, [isSuccess, isError, message, isLoading, navigate, dispatch, isEditMode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!formData.skillsRequired.includes(skillInput.trim())) {
        setFormData({
          ...formData,
          skillsRequired: [...formData.skillsRequired, skillInput.trim()],
        });
      }
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skillsRequired: formData.skillsRequired.filter(s => s !== skillToRemove),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditMode) {
      dispatch(updateJob({ id, jobData: formData }));
    } else {
      dispatch(createJob(formData));
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <header className="mb-8">
          <h1 className="page-title">{isEditMode ? 'Edit Job' : 'Post a New Job'}</h1>
          <p className="page-subtitle">Fill in the details to attract the best talent.</p>
        </header>

        <div className="max-w-4xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="card-static p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="input-label">Job Title</label>
                  <div className="relative">
                    <FiBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" name="title" value={formData.title} onChange={handleChange} required className="input pl-11" placeholder="e.g. Senior Frontend Developer" />
                  </div>
                </div>
                <div>
                  <label className="input-label">Company Name</label>
                  <div className="relative">
                    <FiBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" name="company" value={formData.company} onChange={handleChange} required className="input pl-11" placeholder="e.g. Acme Corp" />
                  </div>
                </div>
                <div>
                  <label className="input-label">Location</label>
                  <div className="relative">
                    <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" name="location" value={formData.location} onChange={handleChange} required className="input pl-11" placeholder="e.g. Remote, Bangalore" />
                  </div>
                </div>
                <div>
                  <label className="input-label">Annual Salary (Optional)</label>
                  <div className="relative">
                    <FiDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="number" name="salary" value={formData.salary} onChange={handleChange} className="input pl-11" placeholder="e.g. 1200000" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="input-label">Job Type</label>
                  <div className="relative">
                    <FiClock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <select name="jobType" value={formData.jobType} onChange={handleChange} className="select pl-11">
                      <option value="full-time">Full Time</option>
                      <option value="part-time">Part Time</option>
                      <option value="internship">Internship</option>
                      <option value="contract">Contract</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="input-label">Experience Level</label>
                  <div className="relative">
                    <FiBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <select name="experienceLevel" value={formData.experienceLevel} onChange={handleChange} className="select pl-11">
                      <option value="fresher">Fresher</option>
                      <option value="junior">Junior (1-3 yrs)</option>
                      <option value="mid">Mid (3-7 yrs)</option>
                      <option value="senior">Senior (7+ yrs)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="input-label">Job Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} required className="input min-h-[160px] py-3" placeholder="Describe the role, responsibilities, and requirements..."></textarea>
              </div>

              <div>
                <label className="input-label">Skills Required (Press Enter to add)</label>
                <div className="relative mb-3">
                  <FiPlus className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    value={skillInput} 
                    onChange={(e) => setSkillInput(e.target.value)} 
                    onKeyDown={handleAddSkill} 
                    className="input pl-11" 
                    placeholder="e.g. React, Node.js, AWS" 
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.skillsRequired.map((skill, i) => (
                    <span key={i} className="badge-primary flex items-center gap-2 py-1.5 px-3">
                      {skill}
                      <button type="button" onClick={() => removeSkill(skill)} className="hover:text-primary"><FiX size={14}/></button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button type="button" onClick={() => navigate('/recruiter/dashboard')} className="btn-secondary">Cancel</button>
              <button type="submit" disabled={isLoading} className="btn-primary">
                {isLoading ? 'Processing...' : (isEditMode ? 'Update Job Posting' : 'Post Job Now')}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateJob;
