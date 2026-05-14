import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

const initialState = {
  jobs: [],
  job: null,
  myJobs: [],
  pages: 1,
  page: 1,
  total: 0,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
};

// @desc    Get all jobs with filters
export const getJobs = createAsyncThunk('jobs/getAll', async (params, thunkAPI) => {
  try {
    const response = await API.get('/jobs', { params });
    return response.data; // Now returns { jobs, page, pages, total }
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

// @desc    Get job by ID
export const getJobById = createAsyncThunk('jobs/getById', async (id, thunkAPI) => {
  try {
    const response = await API.get(`/jobs/${id}`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

// @desc    Create a job
export const createJob = createAsyncThunk('jobs/create', async (jobData, thunkAPI) => {
  try {
    const response = await API.post('/jobs', jobData);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

// @desc    Update a job
export const updateJob = createAsyncThunk('jobs/update', async ({ id, jobData }, thunkAPI) => {
  try {
    const response = await API.put(`/jobs/${id}`, jobData);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

// @desc    Delete a job
export const deleteJob = createAsyncThunk('jobs/delete', async (id, thunkAPI) => {
  try {
    await API.delete(`/jobs/${id}`);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

// @desc    Get recruiter's jobs
export const getMyJobs = createAsyncThunk('jobs/getMyJobs', async (_, thunkAPI) => {
  try {
    const response = await API.get('/jobs/my-jobs');
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    resetJobState: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
    clearJob: (state) => {
      state.job = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all jobs
      .addCase(getJobs.pending, (state) => { 
        state.isLoading = true; 
      })
      .addCase(getJobs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.jobs = action.payload.jobs;
        state.pages = action.payload.pages;
        state.page = action.payload.page;
        state.total = action.payload.total;
      })
      .addCase(getJobs.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get by ID
      .addCase(getJobById.pending, (state) => { 
        state.isLoading = true; 
      })
      .addCase(getJobById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.job = action.payload;
      })
      .addCase(getJobById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Create job
      .addCase(createJob.pending, (state) => { 
        state.isLoading = true; 
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.myJobs.unshift(action.payload);
      })
      .addCase(createJob.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Update job
      .addCase(updateJob.fulfilled, (state, action) => {
        state.isSuccess = true;
        const index = state.myJobs.findIndex((j) => j._id === action.payload._id);
        if (index !== -1) {
          state.myJobs[index] = action.payload;
        }
      })
      // Delete job
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.myJobs = state.myJobs.filter((j) => j._id !== action.payload);
      })
      // Get my jobs
      .addCase(getMyJobs.pending, (state) => { 
        state.isLoading = true; 
      })
      .addCase(getMyJobs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myJobs = action.payload;
      })
      .addCase(getMyJobs.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetJobState, clearJob } = jobSlice.actions;
export default jobSlice.reducer;
