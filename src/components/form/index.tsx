import {StyleSheet} from 'react-native';
import {PropsWithChildren} from 'react';
import {Formik, FormikHelpers} from 'formik';

interface Props<T> extends PropsWithChildren {
  initialValues: any;
  validationSchema: any;
  onSubmit(values: T, formikHelpers?: FormikHelpers<T>): void;
}

const Form = <T extends object>({
  initialValues,
  validationSchema,
  onSubmit,
  children,
}: Props<T>) => {
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}>
      {children}
    </Formik>
  );
};

export default Form;

const styles = StyleSheet.create({});
