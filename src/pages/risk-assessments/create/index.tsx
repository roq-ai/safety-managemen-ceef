import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createRiskAssessment } from 'apiSdk/risk-assessments';
import { Error } from 'components/error';
import { riskAssessmentValidationSchema } from 'validationSchema/risk-assessments';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { AirlineInterface } from 'interfaces/airline';
import { UserInterface } from 'interfaces/user';
import { getAirlines } from 'apiSdk/airlines';
import { getUsers } from 'apiSdk/users';
import { RiskAssessmentInterface } from 'interfaces/risk-assessment';

function RiskAssessmentCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: RiskAssessmentInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createRiskAssessment(values);
      resetForm();
      router.push('/risk-assessments');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<RiskAssessmentInterface>({
    initialValues: {
      assessment: '',
      mitigation_measure: '',
      airline_id: (router.query.airline_id as string) ?? null,
      user_id: (router.query.user_id as string) ?? null,
    },
    validationSchema: riskAssessmentValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Risk Assessment
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="assessment" mb="4" isInvalid={!!formik.errors?.assessment}>
            <FormLabel>Assessment</FormLabel>
            <Input type="text" name="assessment" value={formik.values?.assessment} onChange={formik.handleChange} />
            {formik.errors.assessment && <FormErrorMessage>{formik.errors?.assessment}</FormErrorMessage>}
          </FormControl>
          <FormControl id="mitigation_measure" mb="4" isInvalid={!!formik.errors?.mitigation_measure}>
            <FormLabel>Mitigation Measure</FormLabel>
            <Input
              type="text"
              name="mitigation_measure"
              value={formik.values?.mitigation_measure}
              onChange={formik.handleChange}
            />
            {formik.errors.mitigation_measure && (
              <FormErrorMessage>{formik.errors?.mitigation_measure}</FormErrorMessage>
            )}
          </FormControl>
          <AsyncSelect<AirlineInterface>
            formik={formik}
            name={'airline_id'}
            label={'Select Airline'}
            placeholder={'Select Airline'}
            fetcher={getAirlines}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
              </option>
            )}
          />
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'user_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.email}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'risk_assessment',
    operation: AccessOperationEnum.CREATE,
  }),
)(RiskAssessmentCreatePage);
