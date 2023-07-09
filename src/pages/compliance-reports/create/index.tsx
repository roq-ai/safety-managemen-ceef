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
import { createComplianceReport } from 'apiSdk/compliance-reports';
import { Error } from 'components/error';
import { complianceReportValidationSchema } from 'validationSchema/compliance-reports';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { AirlineInterface } from 'interfaces/airline';
import { UserInterface } from 'interfaces/user';
import { getAirlines } from 'apiSdk/airlines';
import { getUsers } from 'apiSdk/users';
import { ComplianceReportInterface } from 'interfaces/compliance-report';

function ComplianceReportCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: ComplianceReportInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createComplianceReport(values);
      resetForm();
      router.push('/compliance-reports');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<ComplianceReportInterface>({
    initialValues: {
      report: '',
      compliance_status: '',
      operational_area: '',
      airline_id: (router.query.airline_id as string) ?? null,
      user_id: (router.query.user_id as string) ?? null,
    },
    validationSchema: complianceReportValidationSchema,
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
            Create Compliance Report
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
          <FormControl id="compliance_status" mb="4" isInvalid={!!formik.errors?.compliance_status}>
            <FormLabel>Compliance Status</FormLabel>
            <Input
              type="text"
              name="compliance_status"
              value={formik.values?.compliance_status}
              onChange={formik.handleChange}
            />
            {formik.errors.compliance_status && <FormErrorMessage>{formik.errors?.compliance_status}</FormErrorMessage>}
          </FormControl>
          <FormControl id="operational_area" mb="4" isInvalid={!!formik.errors?.operational_area}>
            <FormLabel>Operational Area</FormLabel>
            <Input
              type="text"
              name="operational_area"
              value={formik.values?.operational_area}
              onChange={formik.handleChange}
            />
            {formik.errors.operational_area && <FormErrorMessage>{formik.errors?.operational_area}</FormErrorMessage>}
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
    entity: 'compliance_report',
    operation: AccessOperationEnum.CREATE,
  }),
)(ComplianceReportCreatePage);
