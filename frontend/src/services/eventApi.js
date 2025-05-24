// eventApi.js
import api from './api';

export const fetchEventById = async (eventId) => {
  const response = await api.get(`/event/${eventId}`);
  return response.data;
};

// You can add more related endpoints here later:
// export const createEvent = async (data) => api.post('/event', data);
// export const updateEvent = async (id, data) => api.put(`/event/${id}`, data);
