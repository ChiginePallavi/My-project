import axios from 'axios';

const TOKEN_KEY = 'placement-jwt-token';
const AUTH_STORAGE_KEY = 'placement-auth-user';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
});

// Bonus 1: Axios Request Interceptor - Attach JWT Token automatically
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Bonus 1: Axios Response Interceptor - Handle 401 Unauthorized errors automatically
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
    return Promise.reject(error);
  }
);

const getErrorMessage = (error) => {
  if (error.response) {
    if (error.response.status === 502) {
      return 'Backend server is unreachable (502 Bad Gateway). Please verify that the Express backend is running on port 5000.';
    }
    return error.response.data?.message || `Server error (${error.response.status})`;
  }

  if (error.request) {
    return 'Unable to reach the backend server. Please verify the Express API server is running on port 5000.';
  }

  return error.message || 'An unexpected error occurred.';
};

const handleResponse = (response) => response.data;

const handleError = (error) => {
  throw new Error(getErrorMessage(error));
};

export const getOpportunities = async (params = {}) => {
  try {
    return handleResponse(await apiClient.get('/opportunities', { params }));
  } catch (error) {
    handleError(error);
  }
};

export const getOpportunityById = async (id) => {
  try {
    return handleResponse(await apiClient.get(`/opportunities/${id}`));
  } catch (error) {
    handleError(error);
  }
};

export const createOpportunity = async (payload) => {
  try {
    return handleResponse(await apiClient.post('/opportunities', payload));
  } catch (error) {
    handleError(error);
  }
};

export const updateOpportunity = async (id, payload) => {
  try {
    return handleResponse(await apiClient.put(`/opportunities/${id}`, payload));
  } catch (error) {
    handleError(error);
  }
};

export const deleteOpportunity = async (id) => {
  try {
    return handleResponse(await apiClient.delete(`/opportunities/${id}`));
  } catch (error) {
    handleError(error);
  }
};

export const registerUser = async (payload) => {
  try {
    const formData = new FormData();

    formData.append('name', payload.fullName || payload.name || '');
    formData.append('email', payload.email || '');
    formData.append('password', payload.password || '');
    if (payload.role) formData.append('role', payload.role);

    if (payload.mobile) formData.append('mobile', payload.mobile);
    if (payload.college) formData.append('college', payload.college);
    if (payload.branch) formData.append('branch', payload.branch);
    if (payload.graduationYear) formData.append('graduationYear', payload.graduationYear);
    if (payload.skills) formData.append('skills', payload.skills);
    if (payload.profileImageFile instanceof File) {
      formData.append('profileImage', payload.profileImageFile);
    }

    return handleResponse(await apiClient.post('/auth/register', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }));
  } catch (error) {
    handleError(error);
  }
};

export const loginUser = async (payload) => {
  try {
    return handleResponse(await apiClient.post('/auth/login', payload));
  } catch (error) {
    handleError(error);
  }
};

export const getMe = async () => {
  try {
    return handleResponse(await apiClient.get('/auth/me'));
  } catch (error) {
    handleError(error);
  }
};

export const changePassword = async (payload) => {
  try {
    return handleResponse(await apiClient.put('/auth/change-password', payload));
  } catch (error) {
    handleError(error);
  }
};

export const updateProfile = async (payload) => {
  try {
    const formData = new FormData();
    if (payload.name) formData.append('name', payload.name);
    if (payload.mobile) formData.append('mobile', payload.mobile);
    if (payload.college) formData.append('college', payload.college);
    if (payload.branch) formData.append('branch', payload.branch);
    if (payload.graduationYear) formData.append('graduationYear', payload.graduationYear);
    if (payload.skills) formData.append('skills', payload.skills);
    if (payload.profileImageFile instanceof File) {
      formData.append('profileImage', payload.profileImageFile);
    }

    return handleResponse(await apiClient.put('/auth/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }));
  } catch (error) {
    handleError(error);
  }
};
