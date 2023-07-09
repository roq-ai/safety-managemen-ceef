import * as yup from 'yup';

export const riskAssessmentValidationSchema = yup.object().shape({
  assessment: yup.string().required(),
  mitigation_measure: yup.string().required(),
  airline_id: yup.string().nullable(),
  user_id: yup.string().nullable(),
});
