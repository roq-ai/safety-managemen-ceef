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
import { createSafetyReport } from 'apiSdk/safety-reports';
import { Error } from 'components/error';
import { safetyReportValidationSchema } from 'validationSchema/safety-reports';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { AirlineInterface } from 'interfaces/airline';
import { UserInterface } from 'interfaces/user';
import { getAirlines } from 'apiSdk/airlines';
import { getUsers } from 'apiSdk/users';
import { SafetyReportInterface } from 'interfaces/safety-report';

function SafetyReportCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: SafetyReportInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createSafetyReport(values);
      resetForm();
      router.push('/safety-reports');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<SafetyReportInterface>({
    initialValues: {
      report: '',
      risk_level: '',
      airline_id: (router.query.airline_id as string) ?? null,
      user_id: (router.query.user_id as string) ?? null,
    },
    validationSchema: safetyReportValidationSchema,
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
            Create Safety Report
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="report" mb="4" isInvalid={!!formik.errors?.report}>
            <FormLabel>Report</FormLabel>
            <Input type="text" name="report" value={formik.values?.report} onChange={formik.handleChange} />
            {formik.errors.report && <FormErrorMessage>{formik.errors?.report}</FormErrorMessage>}
          </FormControl>
          <FormControl id="risk_level" mb="4" isInvalid={!!formik.errors?.risk_level}>
            <FormLabel>Risk Level</FormLabel>
            <Input type="text" name="risk_level" value={formik.values?.risk_level} onChange={formik.handleChange} />
            {formik.errors.risk_level && <FormErrorMessage>{formik.errors?.risk_level}</FormErrorMessage>}
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
    entity: 'safety_report',
    operation: AccessOperationEnum.CREATE,
  }),
)(SafetyReportCreatePage);
