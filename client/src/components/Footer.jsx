import { Link } from 'react-router-dom';
import { FiBriefcase, FiGithub, FiTwitter, FiLinkedin } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="container-main py-12">
        <div className="grid grid-cols-1 gap-8">
          {/* Brand / About */}
          <div className="max-w-2xl">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary rounded-xl flex items-center justify-center">
                <FiBriefcase className="text-white text-lg" />
              </div>
              <span className="text-xl font-bold text-slate-900">
                Hire<span className="text-primary">Sphere</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed">
              Professional job portal connecting talented candidates with top recruiters. Build your career with modern recruitment tools.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} HireSphere. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-slate-400 hover:text-primary transition-colors">
              <FiGithub size={18} />
            </a>
            <a href="#" className="text-slate-400 hover:text-primary transition-colors">
              <FiTwitter size={18} />
            </a>
            <a href="#" className="text-slate-400 hover:text-primary transition-colors">
              <FiLinkedin size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
