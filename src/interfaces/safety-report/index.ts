import { AirlineInterface } from 'interfaces/airline';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface SafetyReportInterface {
  id?: string;
  report: string;
  risk_level: string;
  airline_id?: string;
  user_id?: string;
  created_at?: any;
  updated_at?: any;

  airline?: AirlineInterface;
  user?: UserInterface;
  _count?: {};
}

export interface SafetyReportGetQueryInterface extends GetQueryInterface {
  id?: string;
  report?: string;
  risk_level?: string;
  airline_id?: string;
  user_id?: string;
}
