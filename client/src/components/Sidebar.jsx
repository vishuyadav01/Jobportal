import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiGrid, FiBriefcase, FiUser, FiSend, FiCpu, FiUsers, FiSettings, FiBarChart2 } from 'react-icons/fi';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const candidateLinks = [
    { title: 'My Applications', path: '/my-applications', icon: FiSend },
    { title: 'Browse Jobs', path: '/jobs', icon: FiBriefcase },
    { title: 'Profile', path: '/profile', icon: FiUser },
  ];

  const recruiterLinks = [
    { title: 'Post a Job', path: '/recruiter/create-job', icon: FiBriefcase },
    { title: 'Manage Jobs', path: '/recruiter/my-jobs', icon: FiSettings },
  ];

  const links = user?.role === 'recruiter' ? recruiterLinks : candidateLinks;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-screen hidden lg:block sticky top-16 h-[calc(100vh-64px)] overflow-y-auto">
      <div className="p-6 space-y-8">
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-4">Main Menu</p>
          <div className="space-y-1">
            {links.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all group ${
                    isActive 
                      ? 'bg-primary/10 text-primary shadow-sm shadow-primary-100' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-primary'
                  }`}
                >
                  <link.icon className={isActive ? 'text-primary' : 'text-slate-400 group-hover:text-primary'} size={18} />
                  {link.title}
                </Link>
              );
            })}
          </div>
        </div>


      </div>
    </aside>
  );
};

export default Sidebar;
