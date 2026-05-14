import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMyJobs, deleteJob } from '../features/jobs/jobSlice';
import Sidebar from '../components/Sidebar';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import { FiBriefcase, FiUsers, FiPlus, FiMoreVertical, FiEye, FiEdit2, FiTrash2, FiTrendingUp } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import ConfirmModal from '../components/ConfirmModal';

const RecruiterDashboard = () => {
  const dispatch = useDispatch();
  const { myJobs, isLoading } = useSelector((state) => state.jobs);
  const { user } = useSelector((state) => state.auth);
  const [activeMenu, setActiveMenu] = useState(null);
  const [jobToDelete, setJobToDelete] = useState(null);

  useEffect(() => {
    dispatch(getMyJobs());
  }, [dispatch]);

  const handleDeleteJob = (id) => {
    dispatch(deleteJob(id)).then(() => {
      toast.success('Job deleted');
      setActiveMenu(null);
      setJobToDelete(null);
    });
  };

  const stats = [
    { label: 'Active Jobs', value: myJobs.length, icon: FiBriefcase, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Total Applicants', value: '...', icon: FiUsers, color: 'text-accent-600', bg: 'bg-accent-50' },
    { label: 'Hirings', value: '0', icon: FiTrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="page-title">Recruiter Hub</h1>
            <p className="page-subtitle">Manage your job postings and find the perfect candidates.</p>
          </div>
          <Link to="/recruiter/create-job" className="btn-primary">
            <FiPlus className="mr-2" /> Post New Job
          </Link>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="stat-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* My Jobs List */}
        <div className="card-static">
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-title">My Job Postings</h2>
          </div>

          {isLoading ? <Loader /> : myJobs.length === 0 ? (
            <EmptyState 
              icon={FiBriefcase} 
              title="No jobs posted yet" 
              description="Reach thousands of candidates by posting your first job."
              action={<Link to="/recruiter/create-job" className="btn-primary btn-sm">Post a Job</Link>}
            />
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Job Role</th>
                    <th>Location</th>
                    <th>Type</th>
                    <th>Posted On</th>
                    <th>Applicants</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {myJobs.map((job) => (
                    <tr key={job._id}>
                      <td className="font-medium text-slate-900">{job.title}</td>
                      <td>{job.location}</td>
                      <td><span className="badge-primary capitalize">{job.jobType}</span></td>
                      <td>{new Date(job.createdAt).toLocaleDateString()}</td>
                      <td>
                        <Link to={`/recruiter/applicants/${job._id}`} className="text-primary hover:underline font-semibold">
                          View
                        </Link>
                      </td>
                      <td className="text-right">
                        <div className="relative inline-block text-left">
                          <button 
                            onClick={() => setActiveMenu(activeMenu === job._id ? null : job._id)}
                            className="p-2 hover:bg-slate-100 rounded-lg"
                          >
                            <FiMoreVertical />
                          </button>
                          
                          {activeMenu === job._id && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)}></div>
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-20 animate-slide-down">
                                <Link to={`/jobs/${job._id}`} className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
                                  <FiEye size={14}/> View Public Page
                                </Link>
                                <Link to={`/recruiter/edit-job/${job._id}`} className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
                                  <FiEdit2 size={14}/> Edit Details
                                </Link>
                                <button 
                                  onClick={() => setJobToDelete(job._id)}
                                  className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                                >
                                  <FiTrash2 size={14}/> Delete Job
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <ConfirmModal 
        isOpen={!!jobToDelete}
        onClose={() => setJobToDelete(null)}
        onConfirm={() => handleDeleteJob(jobToDelete)}
        title="Delete Job Posting?"
        message="Are you sure you want to delete this job? This will also permanently remove all applications associated with it. This action cannot be undone."
      />
    </div>
  );
};

export default RecruiterDashboard;
