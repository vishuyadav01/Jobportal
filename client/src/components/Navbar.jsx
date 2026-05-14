import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../features/auth/authSlice';
import { FiBriefcase, FiLogOut, FiUser, FiGrid, FiSearch, FiHome, FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/login');
  };

  const navLinks = [
    { title: 'Home', path: '/', icon: FiHome },
  ];

  navLinks.push({ title: 'Browse Jobs', path: '/jobs', icon: FiSearch });

  if (user) {
    if (user.role === 'candidate') {
      navLinks.push(
        { title: 'My Applications', path: '/my-applications', icon: FiGrid },
        { title: 'Profile', path: '/profile', icon: FiUser }
      );
    } else if (user.role === 'recruiter') {
      navLinks.push(
        { title: 'Create Job', path: '/recruiter/create-job', icon: FiBriefcase }
      );
    }
  }

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="container-main">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary rounded-lg flex items-center justify-center shadow-sm">
                <FiBriefcase className="text-white text-lg" />
              </div>
              <span className="text-xl font-bold text-slate-900 hidden sm:block">
                Hire<span className="text-primary">Sphere</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
              >
                {link.title}
              </Link>
            ))}

            {user ? (
              <div className="flex items-center gap-4 ml-4 pl-4 border-l border-slate-200">
                <div className="text-right hidden lg:block">
                  <p className="text-xs font-bold text-slate-900 leading-none">{user.name}</p>
                  <p className="text-[10px] text-slate-400 uppercase mt-1 tracking-wider">{user.role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  title="Logout"
                >
                  <FiLogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 ml-4">
                <Link to="/login" className="btn-ghost py-2">Sign In</Link>
                <Link to="/register" className="btn-primary py-2">Join Now</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 py-4 px-4 space-y-2 animate-slide-down">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-primary/10 hover:text-primary rounded-xl transition-all"
            >
              <link.icon size={18} />
              <span className="font-bold">{link.title}</span>
            </Link>
          ))}
          <hr className="border-slate-100 my-2" />
          {user ? (
            <button
              onClick={() => {
                handleLogout();
                setIsMenuOpen(false);
              }}
              className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all"
            >
              <FiLogOut size={18} />
              <span className="font-medium">Logout</span>
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="btn-secondary py-3"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setIsMenuOpen(false)}
                className="btn-primary py-3"
              >
                Join Now
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
