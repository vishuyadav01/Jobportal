import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiBriefcase, FiSearch, FiUsers, FiCpu, FiArrowRight, FiCheckCircle, FiStar, FiMapPin, FiDollarSign, FiPlus, FiGrid, FiShield } from 'react-icons/fi';
import API from '../api/axios';
import JobCard from '../components/JobCard';
import JobSkeleton from '../components/JobSkeleton';
import EmptyState from '../components/EmptyState';
import Footer from '../components/Footer';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [latestJobs, setLatestJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // No automatic redirection - allow recruiters to see the home page
  // Allow everyone to see the home page
  useEffect(() => {
    // Redirection removed to allow home page access for all roles
  }, [user, navigate]);

  useEffect(() => {
    const fetchLatestJobs = async () => {
      try {
        const { data } = await API.get('/jobs/latest');
        setLatestJobs(data);
      } catch (error) {
        console.error('Failed to fetch latest jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchLatestJobs();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/jobs?keyword=${searchQuery}`);
    }
  };

  const candidateFeatures = [
    { icon: FiSearch, title: 'Smart Job Search', description: 'Find jobs that match your skills with advanced filters.', color: 'from-[#FF6363] to-[#EE5252]' },
    { icon: FiUsers, title: 'Top Companies', description: 'Access opportunities from leading world-class organizations.', color: 'from-[#10B981] to-[#059669]' },
    { icon: FiCheckCircle, title: 'Real-time Tracking', description: 'Track all your applications and hiring stages in one place.', color: 'from-[#FF6363] to-[#EE5252]' },
    { icon: FiStar, title: 'Skill Matching', description: 'Get personalized recommendations based on your profile.', color: 'from-[#10B981] to-[#059669]' },
  ];

  const recruiterFeatures = [
    { icon: FiBriefcase, title: 'Post Job Openings', description: 'Reach thousands of qualified candidates in minutes.', color: 'from-[#FF6363] to-[#EE5252]' },
    { icon: FiUsers, title: 'Talent Sourcing', description: 'Browse and filter through top-tier professional profiles.', color: 'from-[#10B981] to-[#059669]' },
    { icon: FiCheckCircle, title: 'Applicant Tracking', description: 'Manage your entire hiring pipeline with our simple CRM.', color: 'from-[#FF6363] to-[#EE5252]' },
    { icon: FiStar, title: 'Hiring Analytics', description: 'Get insights into your postings and applicant quality.', color: 'from-[#10B981] to-[#059669]' },
  ];

  const isRecruiter = user?.role === 'recruiter';
  const displayFeatures = isRecruiter ? recruiterFeatures : candidateFeatures;

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-primary/50 py-20 lg:py-32">
        <div className="container-main relative">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
              <FiStar className="text-primary" size={14} />
              <span className="text-sm font-medium text-primary uppercase tracking-wider">
                {isRecruiter ? 'Premium Recruitment Tools' : 'The Future of Hiring'}
              </span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 leading-tight mb-6">
              {isRecruiter ? (
                <>Hire Your Next <span className="text-primary">Star Employee</span></>
              ) : (
                <>Your Career Journey <br /> <span className="text-primary">Starts Here</span></>
              )}
            </h1>
            <p className="text-lg text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
              {isRecruiter 
                ? 'Empower your hiring team with professional tools to find, track, and hire the best talent globally.'
                : 'HireSphere connects talented individuals with world-class companies using professional recruitment tools.'}
            </p>

            {isRecruiter ? (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/recruiter/create-job" className="btn-primary btn-lg w-full sm:w-auto">
                  <FiPlus className="mr-2" /> Post New Job
                </Link>
                <Link to="/recruiter/dashboard" className="btn-secondary btn-lg w-full sm:w-auto">
                  <FiGrid className="mr-2" /> Go to Dashboard
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 p-2 bg-white rounded-2xl shadow-xl border border-slate-100 max-w-2xl mx-auto">
                <div className="flex-1 relative">
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search job titles or companies..." 
                    className="w-full bg-transparent border-0 focus:ring-0 py-3 pl-11 text-slate-900"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn-primary py-3 px-8 rounded-xl">Search Jobs</button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Featured Jobs / Recruiter Section */}
      <section className="py-20 bg-white">
        <div className="container-main">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="section-title">
                {isRecruiter ? 'Talent Landscape' : 'Featured Opportunities'}
              </h2>
              <p className="text-slate-500 mt-2">
                {isRecruiter 
                  ? 'See the latest activity in the job market.' 
                  : 'The latest roles from top-tier companies.'}
              </p>
            </div>
            {!isRecruiter && (
              <Link to="/jobs" className="text-primary font-bold flex items-center gap-2 hover:underline transition-all">
                View All Jobs <FiArrowRight />
              </Link>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <JobSkeleton key={i} />)}
            </div>
          ) : latestJobs.length === 0 ? (
            <EmptyState title="No jobs available" description="Check back later for new opportunities." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestJobs.map((job) => <JobCard key={job._id} job={job} />)}
            </div>
          )}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-slate-50 border-y border-slate-100">
        <div className="container-main">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900">
              {isRecruiter ? 'Powerful Tools for Hiring Managers' : 'Everything You Need to Get Hired'}
            </h2>
            <p className="text-slate-500 mt-4">
              {isRecruiter 
                ? 'Streamline your recruitment process with features built for speed and quality.'
                : 'From discovery to application, we provide the tools to accelerate your career.'}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayFeatures.map((feature, i) => (
              <div key={i} className="card-static group hover:border-primary/30 transition-all bg-white hover:shadow-xl hover:-translate-y-1">
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg`}>
                  <feature.icon className="text-white" size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Home;
