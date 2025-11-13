import axiosInstance from './axios.config';
import { API_ENDPOINTS } from '../utils/constants';

const startChatSession = () => {
  return axiosInstance.post(API_ENDPOINTS.CHAT.START_SESSION, {});
};

const getChatSessions = (page = 0, size = 15) => {
  return axiosInstance.get(API_ENDPOINTS.CHAT.GET_SESSIONS, {
    params: { page, size },
  });
};

const getSessionDetails = (sessionId, page = 0, size = 50) => {
  return axiosInstance.get(API_ENDPOINTS.CHAT.GET_SESSION_DETAILS(sessionId), {
    params: { page, size },
  });
};

const rateChatSession = (sessionId, rating, feedback) => {
  return axiosInstance.post(API_ENDPOINTS.CHAT.RATE_SESSION(sessionId), {
    rating,
    feedback,
  });
};

const endChatSession = (sessionId) => {
  return axiosInstance.put(API_ENDPOINTS.CHAT.END_SESSION(sessionId));
};

export const chatAPI = {
  startChatSession,
  getChatSessions,
  getSessionDetails,
  rateChatSession,
  endChatSession,
};