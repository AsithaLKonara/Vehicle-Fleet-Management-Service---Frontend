import apiClient from '../lib/apiClient';

export interface AuditLog {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  userId: string;
  metadata: any;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
}

export const getAuditLogs = async (): Promise<AuditLog[]> => {
  const response = await apiClient.get('/audit');
  return response.data.data;
};
