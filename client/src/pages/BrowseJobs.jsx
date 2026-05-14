import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiSearch, FiMapPin, FiBriefcase, FiDollarSign, FiFilter, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import API from '../api/axios';
import JobCard from '../components/JobCard';
import JobSkeleton from '../components/JobSkeleton';
import EmptyState from '../components/EmptyState';

const BrowseJobs = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    keyword: queryParams.get('keyword') || '',
    location: queryParams.get('location') || '',
    jobType: queryParams.get('jobType') || '',
    experienceLevel: queryParams.get('experienceLevel') || '',
    salaryMin: queryParams.get('salaryMin') || '',
    pageNumber: queryParams.get('pageNumber') || 1,
  });
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      const { data } = await API.get(`/jobs?${params.toString()}`);
      setJobs(data.jobs);
      setPages(data.pages);
      setTotal(data.total);
    } catch (error) {
      console.error('Error fetching jobs');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, pageNumber: 1 }));
    const newParams = new URLSearchParams(location.search);
    if (value) newParams.set(key, value);
    else newParams.delete(key);
    newParams.set('pageNumber', 1);
    navigate({ search: newParams.toString() });
  };

  const clearFilters = () => {
    const cleared = { keyword: '', location: '', jobType: '', experienceLevel: '', salaryMin: '', pageNumber: 1 };
    setFilters(cleared);
    navigate({ search: '' });
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="container-main">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className={`lg:w-1/4 space-y-6 ${isFilterOpen ? 'fixed inset-0 z-50 bg-white p-6 overflow-y-auto' : 'hidden lg:block'}`}>
            <div className="flex items-center justify-between lg:hidden mb-6">
              <h2 className="text-xl font-bold">Filters</h2>
              <button onClick={() => setIsFilterOpen(false)}><FiX size={24} /></button>
            </div>

            <div className="card-static bg-white shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <FiFilter className="text-primary" /> Filters
                </h3>
                <button onClick={clearFilters} className="text-xs text-primary font-bold hover:underline">Clear All</button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-3">Search</label>
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Title or company..." 
                      className="input pl-10 py-2 text-sm"
                      value={filters.keyword}
                      onChange={(e) => handleFilterChange('keyword', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-3">Location</label>
                  <div className="relative">
                    <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="City or remote..." 
                      className="input pl-10 py-2 text-sm"
                      value={filters.location}
                      onChange={(e) => handleFilterChange('location', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-3">Job Type</label>
                  <select 
                    className="input py-2 text-sm"
                    value={filters.jobType}
                    onChange={(e) => handleFilterChange('jobType', e.target.value)}
                  >
                    <option value="">All Types</option>
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-3">Experience</label>
                  <select 
                    className="input py-2 text-sm"
                    value={filters.experienceLevel}
                    onChange={(e) => handleFilterChange('experienceLevel', e.target.value)}
                  >
                    <option value="">All Levels</option>
                    <option value="fresher">Fresher</option>
                    <option value="junior">Junior</option>
                    <option value="mid">Mid Level</option>
                    <option value="senior">Senior</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-3">Min Salary ($)</label>
                  <input 
                    type="number" 
                    placeholder="Min annual salary" 
                    className="input py-2 text-sm"
                    value={filters.salaryMin}
                    onChange={(e) => handleFilterChange('salaryMin', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:w-3/4">
            <div className="flex items-center justify-between mb-8">
              <p className="text-slate-500 font-medium">
                Found <span className="text-slate-900 font-bold">{total}</span> jobs
              </p>
              <button 
                onClick={() => setIsFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold shadow-sm"
              >
                <FiFilter /> Filters
              </button>
            </div>

            {loading ? (
              <div className="grid sm:grid-cols-2 gap-6">
                {[...Array(6)].map((_, i) => <JobSkeleton key={i} />)}
              </div>
            ) : jobs.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-100">
                <EmptyState title="No jobs found" description="Try adjusting your filters or search terms." />
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-6">
                {jobs.map((job) => <JobCard key={job._id} job={job} />)}
              </div>
            )}

            {/* Pagination */}
            {pages > 1 && (
              <div className="mt-12 flex justify-center gap-2">
                <button 
                  disabled={filters.pageNumber === 1}
                  onClick={() => handleFilterChange('pageNumber', filters.pageNumber - 1)}
                  className="p-3 bg-white border border-slate-200 rounded-xl disabled:opacity-50 hover:bg-slate-50 transition-colors shadow-sm"
                >
                  <FiChevronLeft />
                </button>
                {[...Array(pages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => handleFilterChange('pageNumber', i + 1)}
                    className={`w-10 h-10 rounded-xl font-bold text-sm transition-all shadow-sm ${
                      filters.pageNumber === i + 1 
                        ? 'bg-primary text-white' 
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button 
                  disabled={filters.pageNumber === pages}
                  onClick={() => handleFilterChange('pageNumber', filters.pageNumber + 1)}
                  className="p-3 bg-white border border-slate-200 rounded-xl disabled:opacity-50 hover:bg-slate-50 transition-colors shadow-sm"
                >
                  <FiChevronRight />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default BrowseJobs;
