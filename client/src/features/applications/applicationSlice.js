import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

const initialState = {
  applications: [],
  applicants: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
};

// @desc    Apply for a job
export const applyForJob = createAsyncThunk('applications/apply', async (jobId, thunkAPI) => {
  try {
    const response = await API.post(`/applications/apply/${jobId}`);
    return response.data.application;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

// @desc    Get candidate's applications
export const getMyApplications = createAsyncThunk('applications/getMine', async (_, thunkAPI) => {
  try {
    const response = await API.get('/applications/my-applications');
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

// @desc    Get applicants for a job (Recruiter)
export const getJobApplicants = createAsyncThunk('applications/getApplicants', async (jobId, thunkAPI) => {
  try {
    const response = await API.get(`/applications/applicants/${jobId}`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

// @desc    Update application status (Recruiter)
export const updateApplicationStatus = createAsyncThunk('applications/updateStatus', async ({ id, status }, thunkAPI) => {
  try {
    const response = await API.put(`/applications/status/${id}`, { status });
    return response.data.application;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

const applicationSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    resetAppState: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Apply for job
      .addCase(applyForJob.pending, (state) => { 
        state.isLoading = true; 
      })
      .addCase(applyForJob.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.applications.unshift(action.payload);
      })
      .addCase(applyForJob.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get my applications
      .addCase(getMyApplications.pending, (state) => { 
        state.isLoading = true; 
      })
      .addCase(getMyApplications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.applications = action.payload;
      })
      .addCase(getMyApplications.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get job applicants
      .addCase(getJobApplicants.pending, (state) => { 
        state.isLoading = true; 
      })
      .addCase(getJobApplicants.fulfilled, (state, action) => {
        state.isLoading = false;
        state.applicants = action.payload;
      })
      .addCase(getJobApplicants.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Update status
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        state.isSuccess = true;
        const index = state.applicants.findIndex((a) => a._id === action.payload._id);
        if (index !== -1) {
          state.applicants[index] = action.payload;
        }
      });
  },
});

export const { resetAppState } = applicationSlice.actions;
export default applicationSlice.reducer;
