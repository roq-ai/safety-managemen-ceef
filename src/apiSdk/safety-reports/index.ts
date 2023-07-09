import axios from 'axios';
import queryString from 'query-string';
import { SafetyReportInterface, SafetyReportGetQueryInterface } from 'interfaces/safety-report';
import { GetQueryInterface } from '../../interfaces';

export const getSafetyReports = async (query?: SafetyReportGetQueryInterface) => {
  const response = await axios.get(`/api/safety-reports${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createSafetyReport = async (safetyReport: SafetyReportInterface) => {
  const response = await axios.post('/api/safety-reports', safetyReport);
  return response.data;
};

export const updateSafetyReportById = async (id: string, safetyReport: SafetyReportInterface) => {
  const response = await axios.put(`/api/safety-reports/${id}`, safetyReport);
  return response.data;
};

export const getSafetyReportById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/safety-reports/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteSafetyReportById = async (id: string) => {
  const response = await axios.delete(`/api/safety-reports/${id}`);
  return response.data;
};
