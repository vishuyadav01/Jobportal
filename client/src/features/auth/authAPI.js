import API from '../../api/axios';

const register = async (userData) => {
  const response = await API.post('/auth/register', userData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

const login = async (userData) => {
  const response = await API.post('/auth/login', userData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem('user');
};

const getProfile = async () => {
  const response = await API.get('/auth/profile');
  return response.data;
};

const updateProfile = async (userData) => {
  const response = await API.put('/auth/profile', userData);
  return response.data;
};

const uploadResume = async (formData) => {
  const response = await API.post('/auth/upload-resume', formData);
  return response.data;
};

const authAPI = {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  uploadResume,
};

export default authAPI;
