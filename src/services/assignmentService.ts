import apiClient from '../lib/apiClient';

export interface Assignment {
  id: string;
  vehicleId: string;
  driverId: string;
  assignedById: string;
  assignedAt: string;
  returnedAt: string | null;
  vehicle: {
    plateNumber: string;
    make: string;
    model: string;
  };
  driver: {
    name: string;
    email: string;
  };
  assignedBy: {
    name: string;
  };
}

export const getAssignments = async (): Promise<Assignment[]> => {
  const response = await apiClient.get('/assignments');
  return response.data.data;
};

export const createAssignment = async (data: { vehicleId: string; driverId: string }): Promise<Assignment> => {
  const response = await apiClient.post('/assignments', data);
  return response.data.data;
};

export const returnVehicle = async (id: string): Promise<Assignment> => {
  const response = await apiClient.patch(`/assignments/${id}/return`);
  return response.data.data;
};
