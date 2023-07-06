import AuthInputField from '@components/form/AuthInputField';
import {StyleSheet, View} from 'react-native';
import * as yup from 'yup';
import Form from '@components/form';
import SubmitBtn from '@components/form/SubmitBtn';
import AppLink from '@ui/AppLink';
import AuthFormContainer from '@components/AuthFormContainer';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {AuthStackParamList} from 'src/@types/navigation';
import {FormikHelpers} from 'formik';
import client from 'src/api/client';
import {useDispatch} from 'react-redux';
import {catchAsyncError} from 'src/api/catchError';
import {updateNotification} from 'src/store/notificationSlice';

const lostPasswordSchema = yup.object({
  email: yup
    .string()
    .email('Invalid email!')
    .trim('Email is missing!')
    .required('Email is required!'),
});

interface InitialValue {
  email: string;
}

const initialValues = {
  email: '',
};

const LostPassword = () => {
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();
  const dispatch = useDispatch();

  const handleSubmit = async (
    values: InitialValue,
    actions: FormikHelpers<InitialValue>,
  ) => {
    try {
      const {data} = await client.post('/auth/forget-password', {...values});

      console.log(data);
    } catch (error) {
      const errorMessage = catchAsyncError(error);

      dispatch(updateNotification({message: errorMessage, type: 'error'}));
    }
  };

  return (
    <Form
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={lostPasswordSchema}>
      <AuthFormContainer
        heading="Forget Password?"
        subHeading="Oops, did you forget your password? Don't worry, we'll help you get back in.">
        <View style={styles.formContainer}>
          <AuthInputField
            name="email"
            label="Email"
            placeholder="john@email.com"
            autoCapitalize="none"
            keyboardType="email-address"
            containerStyle={styles.marginBottom}
          />

          <SubmitBtn title="Send link" />

          <View style={styles.flexContainer}>
            <AppLink
              title="Create an account"
              onPress={() => navigation.navigate('SignUp')}
            />
            <AppLink
              title="Sign in to my account"
              onPress={() => navigation.navigate('SignIn')}
            />
          </View>
        </View>
      </AuthFormContainer>
    </Form>
  );
};

export default LostPassword;

const styles = StyleSheet.create({
  formContainer: {
    width: '100%',
    paddingHorizontal: 15,
  },
  marginBottom: {
    marginBottom: 20,
  },
  flexContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});
