import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getJobById } from '../features/jobs/jobSlice';
import { applyForJob, getMyApplications } from '../features/applications/applicationSlice';
import { FiMapPin, FiClock, FiDollarSign, FiCalendar, FiArrowLeft, FiSend, FiBriefcase, FiCheckCircle, FiShield } from 'react-icons/fi';
import toast from 'react-hot-toast';
import JobSkeleton from '../components/JobSkeleton';

const JobDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { job, isLoading: jobLoading } = useSelector((state) => state.jobs);
  const { user } = useSelector((state) => state.auth);
  const { applications, isLoading: appLoading } = useSelector((state) => state.applications);
  const [hasApplied, setHasApplied] = useState(false);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    dispatch(getJobById(id));
    if (user && user.role === 'candidate') {
      dispatch(getMyApplications());
    }
  }, [dispatch, id, user]);

  useEffect(() => {
    if (applications && id) {
      const applied = applications.some(app => 
        (app.jobId?._id === id || app.jobId === id)
      );
      setHasApplied(applied);
    }
  }, [applications, id]);

  const handleApply = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'candidate') {
      toast.error('Only candidates can apply for jobs');
      return;
    }
    
    setApplying(true);
    try {
      const res = await dispatch(applyForJob(id)).unwrap();
      toast.success('Application submitted successfully!');
      setHasApplied(true);
    } catch (err) {
      toast.error(err || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  if (jobLoading) return (
    <div className="container-main py-12 max-w-4xl">
      <div className="animate-pulse space-y-8">
        <div className="h-8 bg-slate-200 w-1/4 rounded"></div>
        <div className="h-64 bg-slate-200 rounded-3xl"></div>
      </div>
    </div>
  );

  if (!job) return (
    <div className="container-main py-20 text-center">
      <h2 className="text-2xl font-bold text-slate-900">Job not found</h2>
      <Link to="/jobs" className="text-primary mt-4 inline-block font-bold">Back to Browse Jobs</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-12 animate-fade-in">
      <div className="container-main max-w-4xl">
        <Link to="/jobs" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary mb-8 transition-colors">
          <FiArrowLeft /> Back to Browse Jobs
        </Link>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="p-6 sm:p-10 border-b border-slate-100 bg-gradient-to-r from-white to-slate-50">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="w-20 h-20 bg-white shadow-md rounded-2xl flex items-center justify-center text-primary font-bold text-3xl border border-slate-100">
                {job.company?.[0]}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-black text-slate-900 mb-2">{job.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-slate-500 font-medium">
                  <span className="text-lg text-primary font-bold">{job.company}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                  <span className="flex items-center gap-1.5"><FiMapPin /> {job.location}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 w-full sm:w-auto">
                <span className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-widest text-center">
                  {job.jobType?.replace('-', ' ')}
                </span>
                <span className="px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-widest text-center">
                  {job.experienceLevel}
                </span>
              </div>
            </div>
          </div>

          {/* Key Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 border-b border-slate-100">
            {[
              { icon: FiDollarSign, label: 'Salary (Annual)', value: job.salary ? `$${job.salary.toLocaleString()}` : 'Negotiable' },
              { icon: FiBriefcase, label: 'Experience', value: job.experienceLevel },
              { icon: FiClock, label: 'Posted On', value: new Date(job.createdAt).toLocaleDateString() },
              { icon: FiMapPin, label: 'Location', value: job.location },
            ].map((item, i) => (
              <div key={i} className="p-6 border-r border-slate-100 last:border-0">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                <div className="flex items-center gap-2 text-slate-900 font-bold">
                  <item.icon className="text-primary" size={14} />
                  {item.value}
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 sm:p-10">
            <div className="mb-10">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                About the Position
              </h2>
              <div className="text-slate-600 leading-relaxed whitespace-pre-line text-lg">
                {job.description}
              </div>
            </div>

            {job.skillsRequired?.length > 0 && (
              <div className="mb-10">
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                  Required Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {job.skillsRequired.map((skill, i) => (
                    <span key={i} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold border border-slate-200">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
               <div className="text-slate-500 text-sm italic">
                  * By applying, you agree to share your profile and resume with {job.company}.
               </div>
              
              {user?.role === 'recruiter' ? (
                 <div className="text-primary font-bold bg-primary/5 px-6 py-4 rounded-2xl border border-primary/20 flex items-center gap-3">
                    <FiBriefcase className="text-primary" size={20} />
                    <span>You are viewing this job as a Recruiter.</span>
                 </div>
              ) : hasApplied ? (
                <button disabled className="btn-secondary btn-lg bg-emerald-50 text-emerald-700 border-emerald-200 w-full sm:w-auto flex items-center gap-2">
                  <FiCheckCircle /> Already Applied
                </button>
              ) : (
                <button 
                  onClick={handleApply} 
                  disabled={applying}
                  className="btn-primary btn-lg w-full sm:w-auto shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
                >
                  {applying ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : <FiSend />}
                  {applying ? 'Submitting...' : 'Apply for this Job'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
