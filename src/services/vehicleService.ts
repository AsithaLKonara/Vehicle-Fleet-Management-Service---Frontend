import apiClient from '../lib/apiClient';

export interface Vehicle {
  id: string;
  plateNumber: string;
  make: string;
  model: string;
  year: number;
  purchaseCost: number;
  status: 'AVAILABLE' | 'ASSIGNED' | 'MAINTENANCE' | 'INACTIVE';
  type?: string;
  mileage?: number;
  imageUrl?: string;
  assignments?: Array<{
    id: string;
    driver: {
      id: string;
      name: string;
      email: string;
    };
    assignedBy?: {
      id: string;
      name: string;
    };
    assignedAt: string;
    returnedAt: string | null;
  }>;
  serviceRecords?: Array<{
    id: string;
    title: string;
    description?: string;
    serviceDate: string;
    cost: number;
  }>;
}

export const getVehicles = async (params?: { status?: string; type?: string; search?: string; driverName?: string }): Promise<Vehicle[]> => {
  const response = await apiClient.get('/vehicles', { params });
  return response.data.data;
};

export const createVehicle = async (data: Omit<Vehicle, 'id' | 'assignments' | 'serviceRecords'>): Promise<Vehicle> => {
  const response = await apiClient.post('/vehicles', data);
  return response.data.data;
};

export const updateVehicle = async (id: string, data: Partial<Vehicle>): Promise<Vehicle> => {
  const response = await apiClient.patch(`/vehicles/${id}`, data);
  return response.data.data;
};

export const deleteVehicle = async (id: string): Promise<void> => {
  await apiClient.delete(`/vehicles/${id}`);
};
