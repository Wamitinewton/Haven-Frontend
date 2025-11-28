import axiosInstance from './axios.config';
import { API_ENDPOINTS } from '../utils/constants';

const getInsights = (page = 0, size = 10) => {
  return axiosInstance.get(API_ENDPOINTS.INSIGHTS.GET_INSIGHTS, {
    params: { page, size },
  });
};

const generateInsight = () => {
  return axiosInstance.post(API_ENDPOINTS.INSIGHTS.GENERATE_INSIGHT);
};

const getInsightById = (id) => {
  return axiosInstance.get(API_ENDPOINTS.INSIGHTS.GET_INSIGHT_BY_ID(id));
};

const markInsightAsRead = (id) => {
  return axiosInstance.put(API_ENDPOINTS.INSIGHTS.MARK_AS_READ(id));
};

const deleteInsight = (id) => {
  return axiosInstance.delete(API_ENDPOINTS.INSIGHTS.GET_INSIGHT_BY_ID(id));
};

const provideInsightFeedback = (id, helpful, feedback) => {
  return axiosInstance.post(API_ENDPOINTS.INSIGHTS.PROVIDE_FEEDBACK(id), {
    helpful,
    feedback,
  });
};

export const insightAPI = {
  getInsights,
  generateInsight,
  getInsightById,
  markInsightAsRead,
  deleteInsight,
  provideInsightFeedback,
};