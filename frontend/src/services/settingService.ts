import api from './api';

export interface UpdateProfilePayload {
  name: string;
  email: string;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export const updateUserProfile = async (data: UpdateProfilePayload) => {
  const res = await api.put('/settings/profile', data);
  return res.data;
};

export const updateUserPassword = async (data: ChangePasswordPayload) => {
  const res = await api.put('/settings/password', data);
  return res.data;
};
