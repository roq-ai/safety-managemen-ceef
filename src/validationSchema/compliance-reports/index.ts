import * as yup from 'yup';

export const complianceReportValidationSchema = yup.object().shape({
  report: yup.string().required(),
  compliance_status: yup.string().required(),
  operational_area: yup.string().required(),
  airline_id: yup.string().nullable(),
  user_id: yup.string().nullable(),
});
