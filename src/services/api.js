import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

const getErrorMessage = (error) => {
  if (error.response) {
    return error.response.data?.message || `Server error (${error.response.status})`;
  }

  if (error.request) {
    return 'Unable to reach the backend. Please verify the API server is running.';
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
