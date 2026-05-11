import apiClient from '../lib/apiClient';

export interface ServiceRecord {
  id: string;
  vehicleId: string;
  title: string;
  description?: string;
  serviceDate: string;
  cost: number;
  createdAt: string;
}

export const getVehicleServices = async (vehicleId: string): Promise<ServiceRecord[]> => {
  const response = await apiClient.get(`/vehicles/${vehicleId}/services`);
  return response.data.data;
};

export const addVehicleService = async (vehicleId: string, data: Omit<ServiceRecord, 'id' | 'vehicleId' | 'createdAt'>): Promise<ServiceRecord> => {
  const response = await apiClient.post(`/vehicles/${vehicleId}/services`, data);
  return response.data.data;
};
