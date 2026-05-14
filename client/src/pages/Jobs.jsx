import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getJobs } from '../features/jobs/jobSlice';
import JobCard from '../components/JobCard';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import { FiSearch, FiFilter, FiBriefcase } from 'react-icons/fi';

const Jobs = () => {
  const [filters, setFilters] = useState({ search: '', location: '', jobType: '', experienceLevel: '' });
  const [showFilters, setShowFilters] = useState(false);
  const dispatch = useDispatch();
  const { jobs, isLoading } = useSelector((state) => state.jobs);

  useEffect(() => { dispatch(getJobs({})); }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = {};
    Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
    dispatch(getJobs(params));
  };

  const clearFilters = () => {
    setFilters({ search: '', location: '', jobType: '', experienceLevel: '' });
    dispatch(getJobs({}));
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-12 animate-fade-in">
      <div className="container-main">
        <div className="mb-8">
          <h1 className="page-title">Browse Jobs</h1>
          <p className="page-subtitle">Discover opportunities waiting for you</p>
        </div>

        <div className="card-static p-4 sm:p-6 mb-8">
          <form onSubmit={handleSearch}>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input type="text" className="input pl-11" placeholder="Search jobs, companies, skills..." value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
              </div>
              <button type="submit" className="btn-primary"><FiSearch className="mr-2" size={16} />Search</button>
              <button type="button" onClick={() => setShowFilters(!showFilters)} className="btn-secondary"><FiFilter className="mr-2" size={16} />Filters</button>
            </div>
            {showFilters && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-200 animate-slide-down">
                <input type="text" className="input" placeholder="Location" value={filters.location} onChange={(e) => setFilters({ ...filters, location: e.target.value })} />
                <select className="select" value={filters.jobType} onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}>
                  <option value="">All Types</option>
                  <option value="full-time">Full Time</option>
                  <option value="part-time">Part Time</option>
                  <option value="internship">Internship</option>
                  <option value="contract">Contract</option>
                </select>
                <select className="select" value={filters.experienceLevel} onChange={(e) => setFilters({ ...filters, experienceLevel: e.target.value })}>
                  <option value="">All Levels</option>
                  <option value="fresher">Fresher</option>
                  <option value="junior">Junior</option>
                  <option value="mid">Mid</option>
                  <option value="senior">Senior</option>
                </select>
                <button type="button" onClick={clearFilters} className="text-sm text-primary hover:underline">Clear filters</button>
              </div>
            )}
          </form>
        </div>

        {isLoading ? <Loader /> : jobs.length === 0 ? (
          <EmptyState icon={FiBriefcase} title="No jobs found" description="Try adjusting your filters." />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => <JobCard key={job._id} job={job} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
