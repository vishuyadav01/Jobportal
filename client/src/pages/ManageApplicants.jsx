import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getJobApplicants, updateApplicationStatus } from '../features/applications/applicationSlice';
import { getJobById } from '../features/jobs/jobSlice';
import Sidebar from '../components/Sidebar';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import { FiUsers, FiMail, FiPhone, FiFileText, FiArrowLeft, FiCheck, FiX, FiInfo, FiExternalLink } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ManageApplicants = () => {
  const { jobId } = useParams();
  const dispatch = useDispatch();
  const { applicants, isLoading } = useSelector((state) => state.applications);
  const { job } = useSelector((state) => state.jobs);

  useEffect(() => {
    dispatch(getJobApplicants(jobId));
    dispatch(getJobById(jobId));
  }, [dispatch, jobId]);

  const handleStatusUpdate = (appId, status) => {
    dispatch(updateApplicationStatus({ id: appId, status })).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        toast.success(`Candidate ${status} successfully`);
      } else {
        toast.error('Failed to update candidate status');
      }
    });
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <Link to="/recruiter/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-primary mb-4 transition-colors">
              <FiArrowLeft /> Back to Dashboard
            </Link>
            <h1 className="text-3xl font-black text-slate-900 leading-none">Applicants Manager</h1>
            <p className="text-slate-500 mt-2">Managing candidates for <span className="text-primary font-bold">"{job?.title}"</span></p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm text-sm font-bold text-slate-600">
            <FiUsers className="text-primary" />
            {applicants.length} Total Applicants
          </div>
        </header>

        {isLoading ? (
          <div className="grid gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 bg-white rounded-3xl animate-pulse border border-slate-100"></div>
            ))}
          </div>
        ) : applicants.length === 0 ? (
          <EmptyState 
            icon={FiUsers} 
            title="No applicants yet" 
            description="Your job posting is active. Candidates will appear here once they apply."
          />
        ) : (
          <div className="space-y-6">
            {applicants.map((app) => (
              <div key={app._id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden hover:border-primary/20 transition-all">
                <div className="flex flex-col lg:flex-row">
                  {/* Candidate Profile */}
                  <div className="flex-1 p-6 sm:p-8">
                    <div className="flex items-start gap-5 mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-primary/20">
                        {app.candidateId?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="text-xl font-black text-slate-900">{app.candidateId?.name}</h3>
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                            app.status === 'accepted' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                            app.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                          }`}>
                            {app.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-2 text-sm text-slate-500 font-medium">
                          <div className="flex items-center gap-2"><FiMail className="text-primary" /> {app.candidateId?.email}</div>
                          <div className="flex items-center gap-2"><FiPhone className="text-primary" /> {app.candidateId?.phone || 'No phone'}</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Key Skills & Expertise</p>
                      <div className="flex flex-wrap gap-2">
                        {app.candidateId?.skills?.length > 0 ? app.candidateId.skills.map((skill, i) => (
                          <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold border border-slate-200">
                            {skill}
                          </span>
                        )) : <span className="text-sm text-slate-400 italic">No skills listed in profile</span>}
                      </div>
                    </div>
                  </div>

                  {/* Actions Area */}
                  <div className="lg:w-80 bg-slate-50 p-6 sm:p-8 border-t lg:border-t-0 lg:border-l border-slate-200 flex flex-col gap-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Review Process</h4>
                    
                    {app.candidateId?.resumeUrl ? (
                      <button 
                        onClick={() => {
                          const viewerUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(app.candidateId.resumeUrl)}`;
                          window.open(viewerUrl, '_blank', 'noopener,noreferrer');
                        }}
                        className="flex items-center justify-center gap-2 w-full py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-slate-100 transition-all shadow-sm group"
                      >
                        <FiFileText className="text-primary" /> 
                        Preview Candidate Resume
                        <FiExternalLink className="text-slate-300 group-hover:text-primary" size={14} />
                      </button>
                    ) : (
                      <div className="flex items-center gap-3 p-4 bg-amber-50 text-amber-700 rounded-2xl border border-amber-100 text-xs font-bold">
                        <FiInfo size={18} className="flex-shrink-0" />
                        Candidate hasn't uploaded a resume yet.
                      </div>
                    )}

                    <div className="mt-auto space-y-3">
                      {app.status === 'pending' ? (
                        <>
                          <button 
                            onClick={() => handleStatusUpdate(app._id, 'accepted')}
                            className="flex items-center justify-center gap-2 w-full py-3 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
                          >
                            <FiCheck /> Shortlist Candidate
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(app._id, 'rejected')}
                            className="flex items-center justify-center gap-2 w-full py-3 bg-white border border-red-200 text-red-600 font-bold rounded-2xl hover:bg-red-50 transition-all"
                          >
                            <FiX /> Decline Application
                          </button>
                        </>
                      ) : (
                        <div className={`p-4 rounded-2xl border flex items-center justify-center gap-2 font-black text-sm uppercase tracking-widest ${
                          app.status === 'accepted' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'
                        }`}>
                          {app.status === 'accepted' ? <FiCheck /> : <FiX />}
                          Application {app.status}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ManageApplicants;
