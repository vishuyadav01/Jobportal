import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMyApplications } from '../features/applications/applicationSlice';
import Sidebar from '../components/Sidebar';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import { FiBriefcase, FiMapPin, FiClock, FiCheckCircle, FiXCircle, FiClock as FiPending, FiExternalLink } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const MyApplications = () => {
  const dispatch = useDispatch();
  const { applications, isLoading } = useSelector((state) => state.applications);

  useEffect(() => {
    dispatch(getMyApplications());
  }, [dispatch]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'accepted':
        return {
          icon: <FiCheckCircle className="text-emerald-500" />,
          classes: 'bg-emerald-50 text-emerald-700 border-emerald-100',
          text: 'Shortlisted'
        };
      case 'rejected':
        return {
          icon: <FiXCircle className="text-red-500" />,
          classes: 'bg-red-50 text-red-700 border-red-100',
          text: 'Declined'
        };
      default:
        return {
          icon: <FiPending className="text-amber-500" />,
          classes: 'bg-amber-50 text-amber-700 border-amber-100',
          text: 'Pending Review'
        };
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-slate-900 leading-none">My Applications</h1>
          <p className="text-slate-500 mt-2">Track the status of your current job applications.</p>
        </header>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-white rounded-3xl border border-slate-100 animate-pulse"></div>
            ))}
          </div>
        ) : applications.length === 0 ? (
          <EmptyState 
            icon={FiBriefcase}
            title="No applications yet"
            description="You haven't applied for any jobs yet."
          />
        ) : (
          <div className="space-y-4">
            {applications.map((app) => {
              const status = getStatusBadge(app.status);
              const job = app.jobId || {};
              return (
                <div key={app._id} className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-primary/20 transition-all shadow-sm">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-primary font-bold text-xl border border-slate-100">
                      {job.company?.[0] || 'J'}
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900 leading-tight">{job.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-slate-500 font-medium mt-1">
                        <span className="text-primary font-bold">{job.company}</span>
                        <span className="flex items-center gap-1.5"><FiMapPin /> {job.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-black uppercase tracking-widest ${status.classes}`}>
                      {status.icon}
                      {status.text}
                    </div>
                    <Link 
                      to={`/jobs/${job._id}`} 
                      className="p-3 bg-slate-50 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-all border border-slate-100"
                    >
                      <FiExternalLink size={18} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyApplications;
