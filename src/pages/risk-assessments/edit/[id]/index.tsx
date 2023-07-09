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
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getRiskAssessmentById, updateRiskAssessmentById } from 'apiSdk/risk-assessments';
import { Error } from 'components/error';
import { riskAssessmentValidationSchema } from 'validationSchema/risk-assessments';
import { RiskAssessmentInterface } from 'interfaces/risk-assessment';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { AirlineInterface } from 'interfaces/airline';
import { UserInterface } from 'interfaces/user';
import { getAirlines } from 'apiSdk/airlines';
import { getUsers } from 'apiSdk/users';

function RiskAssessmentEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<RiskAssessmentInterface>(
    () => (id ? `/risk-assessments/${id}` : null),
    () => getRiskAssessmentById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: RiskAssessmentInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateRiskAssessmentById(id, values);
      mutate(updated);
      resetForm();
      router.push('/risk-assessments');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<RiskAssessmentInterface>({
    initialValues: data,
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
            Edit Risk Assessment
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
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
        )}
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
    operation: AccessOperationEnum.UPDATE,
  }),
)(RiskAssessmentEditPage);
