import * as yup from 'yup';

export const safetyReportValidationSchema = yup.object().shape({
  report: yup.string().required(),
  risk_level: yup.string().required(),
  airline_id: yup.string().nullable(),
  user_id: yup.string().nullable(),
});
