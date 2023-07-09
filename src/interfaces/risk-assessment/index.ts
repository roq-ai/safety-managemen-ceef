import { AirlineInterface } from 'interfaces/airline';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface RiskAssessmentInterface {
  id?: string;
  assessment: string;
  mitigation_measure: string;
  airline_id?: string;
  user_id?: string;
  created_at?: any;
  updated_at?: any;

  airline?: AirlineInterface;
  user?: UserInterface;
  _count?: {};
}

export interface RiskAssessmentGetQueryInterface extends GetQueryInterface {
  id?: string;
  assessment?: string;
  mitigation_measure?: string;
  airline_id?: string;
  user_id?: string;
}
