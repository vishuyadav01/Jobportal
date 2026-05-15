import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile, updateProfile, uploadResume } from '../features/auth/authSlice';
import Sidebar from '../components/Sidebar';
import Loader from '../components/Loader';
import { FiUser, FiMail, FiPhone, FiMapPin, FiAward, FiFileText, FiUpload, FiCheck, FiInfo, FiTrash2, FiExternalLink } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Profile = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const { profile, user, isLoading } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    skills: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        location: profile.location || '',
        bio: profile.bio || '',
        skills: profile.skills?.join(', ') || '',
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(s => s !== '');
    dispatch(updateProfile({ ...formData, skills: skillsArray })).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        toast.success('Profile updated successfully');
        setIsEditing(false);
      } else {
        toast.error(res.payload || 'Failed to update profile');
      }
    });
  };

  const processFile = async (file) => {
    if (!file) return;
    
    // Validation
    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed!');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    const cloudName = 'dxn4cxnc6';
    const uploadPreset = 'resumes_preset'; // You must create an unsigned preset in Cloudinary Settings -> Upload
    
    setUploadProgress(20);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', 'resumes');

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();
      
      if (data.secure_url) {
        setUploadProgress(100);
        const res = await dispatch(uploadResume({ resumeUrl: data.secure_url })).unwrap();
        toast.success('Resume uploaded successfully');
        setTimeout(() => setUploadProgress(0), 1500);
      } else {
        throw new Error(data.error?.message || 'Upload failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      toast.error(err.message || 'Upload failed');
      setUploadProgress(0);
    }
  };

  const handleResumeUpload = (e) => {
    processFile(e.target.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    processFile(e.dataTransfer.files[0]);
  };

  if (isLoading && !profile) return <Loader />;

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-slate-900 leading-none">Profile Settings</h1>
          <p className="text-slate-500 mt-2">Manage your professional identity and job-seeking preferences.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Stats & Resume */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center shadow-sm">
              <div className="relative inline-block mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-primary/20">
                  <span className="text-white text-3xl font-black">{profile?.name?.charAt(0).toUpperCase()}</span>
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 border-4 border-white rounded-full flex items-center justify-center">
                   <FiCheck className="text-white text-xs" />
                </div>
              </div>
              <h3 className="text-xl font-black text-slate-900">{profile?.name}</h3>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">{profile?.role}</p>
              
              <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-xl font-black text-slate-900 leading-none">{profile?.skills?.length || 0}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-2">Skills Found</p>
                </div>
                <div className="text-center border-l border-slate-100">
                  <p className="text-xl font-black text-slate-900 leading-none">100%</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-2">Completeness</p>
                </div>
              </div>
            </div>

            {/* Premium Resume Upload Section */}
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-black text-slate-900 flex items-center gap-2">
                  <FiFileText className="text-primary" /> Professional Resume
                </h4>
              </div>
              
              {profile?.resumeUrl ? (
                <div className="mb-6">
                   <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm">
                          <FiFileText size={20} />
                        </div>
                        <div>
                          <p className="text-xs font-black text-emerald-800 uppercase tracking-wider leading-none">resume.pdf</p>
                          <p className="text-[10px] text-emerald-600 mt-1">Verified & Active</p>
                        </div>
                      </div>
                      <a 
                        href={profile.resumeUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-all"
                      >
                        <FiExternalLink size={18} />
                      </a>
                   </div>
                </div>
              ) : (
                <div className="bg-slate-50 p-6 rounded-2xl mb-6 border border-dashed border-slate-300 text-center">
                   <FiInfo className="text-slate-400 mx-auto mb-2" size={24} />
                   <p className="text-sm font-medium text-slate-500">No resume uploaded. Recruiters prioritize candidates with resumes.</p>
                </div>
              )}

              {/* Drag and Drop Area */}
              <div 
                className={`relative group cursor-pointer transition-all ${isDragging ? 'scale-105' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  accept="application/pdf" 
                  onChange={handleResumeUpload} 
                />
                <div className={`p-8 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center transition-all ${
                  isDragging ? 'border-primary bg-primary/10' : 'border-slate-200 hover:border-primary/20 hover:bg-slate-50'
                }`}>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-all ${
                    isDragging ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary'
                  }`}>
                    <FiUpload size={24} />
                  </div>
                  <p className="text-sm font-bold text-slate-900">Drag & drop resume</p>
                  <p className="text-xs text-slate-500 mt-1">or click to browse files</p>
                </div>

                {uploadProgress > 0 && (
                  <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center p-6">
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-4">
                      <div 
                        className="bg-primary h-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs font-black text-primary uppercase tracking-widest animate-pulse">
                      {uploadProgress < 100 ? 'Uploading PDF...' : 'Processing...'}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex items-center justify-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                 <span className="flex items-center gap-1"><FiCheck className="text-emerald-500" /> PDF Only</span>
                 <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                 <span className="flex items-center gap-1"><FiCheck className="text-emerald-500" /> Max 5MB</span>
              </div>
            </div>
          </div>

          {/* Right Column: Profile Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                  Profile Details
                </h3>
                <button 
                  onClick={() => setIsEditing(!isEditing)} 
                  className={`px-6 py-2 rounded-xl text-sm font-black transition-all ${
                    isEditing ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' : 'bg-primary/10 text-primary hover:bg-primary/10'
                  }`}
                >
                  {isEditing ? 'Cancel Editing' : 'Edit Profile'}
                </button>
              </div>

              <form onSubmit={handleUpdate} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                    <div className="relative">
                      <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text" 
                        name="name"
                        value={formData.name} 
                        onChange={handleChange}
                        disabled={!isEditing} 
                        className="input pl-11 disabled:bg-slate-50 disabled:border-slate-100 disabled:text-slate-500 font-bold" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Email Address</label>
                    <div className="relative">
                      <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email} 
                        disabled={true} 
                        className="input pl-11 bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed font-medium" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Phone Number</label>
                    <div className="relative">
                      <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text" 
                        name="phone"
                        value={formData.phone} 
                        onChange={handleChange}
                        disabled={!isEditing} 
                        className="input pl-11 disabled:bg-slate-50 font-bold" 
                        placeholder="+1 000 000 0000"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Location</label>
                    <div className="relative">
                      <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text" 
                        name="location"
                        value={formData.location} 
                        onChange={handleChange}
                        disabled={!isEditing} 
                        className="input pl-11 disabled:bg-slate-50 font-bold" 
                        placeholder="e.g. New York, USA"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Professional Bio</label>
                  <textarea 
                    name="bio"
                    value={formData.bio} 
                    onChange={handleChange}
                    disabled={!isEditing} 
                    className="input min-h-[150px] py-4 disabled:bg-slate-50 font-medium resize-none" 
                    placeholder="Briefly describe your professional background and goals..."
                  ></textarea>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Top Skills (Comma Separated)</label>
                  <div className="relative">
                    <FiAward className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text"
                      name="skills"
                      value={formData.skills} 
                      onChange={handleChange}
                      disabled={!isEditing} 
                      className="input pl-11 disabled:bg-slate-50 font-bold" 
                      placeholder="React, Node.js, Python, UI Design..."
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 italic">Separate each skill with a comma to help recruiters find you.</p>
                </div>

                {isEditing && (
                  <div className="flex justify-end pt-4">
                    <button type="submit" className="btn-primary px-10 py-3 shadow-lg shadow-primary/20">
                      Save Profile Changes
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
