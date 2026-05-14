import { Link } from 'react-router-dom';
import { FiMapPin, FiBriefcase, FiDollarSign, FiClock, FiChevronRight } from 'react-icons/fi';

const JobCard = ({ job }) => {
  return (
    <div className="card group hover:shadow-xl transition-all border border-slate-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold text-xl border border-primary/20">
            {job.company?.[0] || 'J'}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">
              {job.title}
            </h3>
            <p className="text-sm font-medium text-slate-500">{job.company}</p>
          </div>
        </div>
        <span className="badge-primary capitalize">{job.jobType?.replace('-', ' ')}</span>
      </div>

      <div className="grid grid-cols-2 gap-y-3 mb-6">
        <div className="flex items-center gap-2 text-slate-500 text-sm">
          <FiMapPin className="text-primary" />
          {job.location}
        </div>
        <div className="flex items-center gap-2 text-slate-500 text-sm">
          <FiDollarSign className="text-primary" />
          {job.salary ? `${job.salary.toLocaleString()}/yr` : 'Not disclosed'}
        </div>
        <div className="flex items-center gap-2 text-slate-500 text-sm">
          <FiBriefcase className="text-primary" />
          {job.experienceLevel}
        </div>
        <div className="flex items-center gap-2 text-slate-500 text-sm">
          <FiClock className="text-primary" />
          {new Date(job.createdAt).toLocaleDateString()}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {job.skillsRequired?.slice(0, 3).map((skill, index) => (
          <span key={index} className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-full uppercase tracking-wider">
            {skill}
          </span>
        ))}
        {job.skillsRequired?.length > 3 && (
          <span className="px-3 py-1 bg-slate-100 text-slate-400 text-[10px] font-bold rounded-full uppercase">
            +{job.skillsRequired.length - 3} more
          </span>
        )}
      </div>

      <Link to={`/jobs/${job._id}`} className="btn-primary w-full py-2.5 rounded-xl flex items-center justify-center gap-2 group/btn">
        View Details
        <FiChevronRight className="group-hover/btn:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
};

export default JobCard;
