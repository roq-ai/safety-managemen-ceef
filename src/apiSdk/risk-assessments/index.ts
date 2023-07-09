import axios from 'axios';
import queryString from 'query-string';
import { RiskAssessmentInterface, RiskAssessmentGetQueryInterface } from 'interfaces/risk-assessment';
import { GetQueryInterface } from '../../interfaces';

export const getRiskAssessments = async (query?: RiskAssessmentGetQueryInterface) => {
  const response = await axios.get(`/api/risk-assessments${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createRiskAssessment = async (riskAssessment: RiskAssessmentInterface) => {
  const response = await axios.post('/api/risk-assessments', riskAssessment);
  return response.data;
};

export const updateRiskAssessmentById = async (id: string, riskAssessment: RiskAssessmentInterface) => {
  const response = await axios.put(`/api/risk-assessments/${id}`, riskAssessment);
  return response.data;
};

export const getRiskAssessmentById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/risk-assessments/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteRiskAssessmentById = async (id: string) => {
  const response = await axios.delete(`/api/risk-assessments/${id}`);
  return response.data;
};
