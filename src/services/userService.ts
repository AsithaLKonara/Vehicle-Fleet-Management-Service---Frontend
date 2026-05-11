import apiClient from '../lib/apiClient';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'FLEET_MANAGER' | 'FLEET_STAFF';
}

export const getUsers = async (): Promise<User[]> => {
  const response = await apiClient.get('/users');
  return response.data.data;
};

export const createUser = async (data: Omit<User, 'id'> & { password: string }): Promise<User> => {
  const response = await apiClient.post('/users', data);
  return response.data.data;
};

export const updateUser = async (id: string, data: Partial<User>): Promise<User> => {
  const response = await apiClient.patch(`/users/${id}`, data);
  return response.data.data;
};

export const deleteUser = async (id: string): Promise<void> => {
  await apiClient.delete(`/users/${id}`);
};
