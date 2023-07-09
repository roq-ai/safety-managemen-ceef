import { ComplianceReportInterface } from 'interfaces/compliance-report';
import { RiskAssessmentInterface } from 'interfaces/risk-assessment';
import { SafetyReportInterface } from 'interfaces/safety-report';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface AirlineInterface {
  id?: string;
  description?: string;
  image?: string;
  name: string;
  created_at?: any;
  updated_at?: any;
  user_id: string;
  tenant_id: string;
  compliance_report?: ComplianceReportInterface[];
  risk_assessment?: RiskAssessmentInterface[];
  safety_report?: SafetyReportInterface[];
  user?: UserInterface;
  _count?: {
    compliance_report?: number;
    risk_assessment?: number;
    safety_report?: number;
  };
}

export interface AirlineGetQueryInterface extends GetQueryInterface {
  id?: string;
  description?: string;
  image?: string;
  name?: string;
  user_id?: string;
  tenant_id?: string;
}
