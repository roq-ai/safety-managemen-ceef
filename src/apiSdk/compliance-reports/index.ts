import axios from 'axios';
import queryString from 'query-string';
import { ComplianceReportInterface, ComplianceReportGetQueryInterface } from 'interfaces/compliance-report';
import { GetQueryInterface } from '../../interfaces';

export const getComplianceReports = async (query?: ComplianceReportGetQueryInterface) => {
  const response = await axios.get(`/api/compliance-reports${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createComplianceReport = async (complianceReport: ComplianceReportInterface) => {
  const response = await axios.post('/api/compliance-reports', complianceReport);
  return response.data;
};

export const updateComplianceReportById = async (id: string, complianceReport: ComplianceReportInterface) => {
  const response = await axios.put(`/api/compliance-reports/${id}`, complianceReport);
  return response.data;
};

export const getComplianceReportById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/compliance-reports/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteComplianceReportById = async (id: string) => {
  const response = await axios.delete(`/api/compliance-reports/${id}`);
  return response.data;
};
