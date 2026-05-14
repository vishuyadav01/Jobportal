import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

const initialState = {
  users: [],
  jobs: [],
  stats: null,
  isLoading: false,
  isError: false,
  message: '',
};

export const getAdminStats = createAsyncThunk('admin/stats', async (_, thunkAPI) => {
  try {
    const response = await API.get('/admin/stats');
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const getAllUsers = createAsyncThunk('admin/users', async (_, thunkAPI) => {
  try {
    const response = await API.get('/admin/users');
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const getAllJobs = createAsyncThunk('admin/jobs', async (_, thunkAPI) => {
  try {
    const response = await API.get('/admin/jobs');
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const adminDeleteJob = createAsyncThunk('admin/deleteJob', async (id, thunkAPI) => {
  try {
    await API.delete(`/admin/jobs/${id}`);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const adminDeleteUser = createAsyncThunk('admin/deleteUser', async (id, thunkAPI) => {
  try {
    await API.delete(`/admin/users/${id}`);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAdminStats.pending, (state) => { state.isLoading = true; })
      .addCase(getAdminStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload;
      })
      .addCase(getAllUsers.pending, (state) => { state.isLoading = true; })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(getAllJobs.pending, (state) => { state.isLoading = true; })
      .addCase(getAllJobs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.jobs = action.payload;
      })
      .addCase(adminDeleteJob.fulfilled, (state, action) => {
        state.jobs = state.jobs.filter((j) => j._id !== action.payload);
      })
      .addCase(adminDeleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u._id !== action.payload);
      });
  },
});

export default adminSlice.reducer;
