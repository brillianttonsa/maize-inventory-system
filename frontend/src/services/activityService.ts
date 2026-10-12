import api from './api';
import type { RecentActivity } from '../types';

export const getRecentActivities = async (): Promise<RecentActivity[]> => {
  try {
    const res = await api.get<RecentActivity[]>('/recent-activities');
    return res.data;
  } catch (err) {
    console.error('Failed to fetch recent activities:', err);
    throw err;
  }
};
