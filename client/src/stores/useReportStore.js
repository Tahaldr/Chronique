import { create } from 'zustand';
import axios from '../lib/axios';
import showToast from '../components/Toast';

export const useReportStore = create((set) => ({
  loading: false,
  reports: [],

  createReport: async (report) => {
    try {
      set({ loading: true });
      const res = await axios.post('/report/createreport', report);
      set({ loading: false });
      return res.data.report;
    } catch (error) {
      set({ loading: false });
      showToast({ message: error.response?.data?.message || 'Report failed', type: 'error' });
    }
  },

  getAllReports: async (limit = 10, page = 1) => {
    try {
      set({ loading: true });
      const res = await axios.get(`/report/getreports?limit=${limit}&page=${page}`);
      set({ loading: false, reports: res.data });
      return res.data;
    } catch (error) {
      set({ loading: false });
      showToast({
        message: error.response?.data?.message || 'Failed to get reports',
        type: 'error',
      });
    }
  },
}));
