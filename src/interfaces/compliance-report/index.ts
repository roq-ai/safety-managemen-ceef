import { AirlineInterface } from 'interfaces/airline';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface ComplianceReportInterface {
  id?: string;
  report: string;
  compliance_status: string;
  operational_area: string;
  airline_id?: string;
  user_id?: string;
  created_at?: any;
  updated_at?: any;

  airline?: AirlineInterface;
  user?: UserInterface;
  _count?: {};
}

export interface ComplianceReportGetQueryInterface extends GetQueryInterface {
  id?: string;
  report?: string;
  compliance_status?: string;
  operational_area?: string;
  airline_id?: string;
  user_id?: string;
}
