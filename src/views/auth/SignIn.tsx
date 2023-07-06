import AuthInputField from '@components/form/AuthInputField';
import colors from '@utils/colors';
import {StyleSheet, View} from 'react-native';
import * as yup from 'yup';
import Form from '@components/form';
import SubmitBtn from '@components/form/SubmitBtn';
import Icon from 'react-native-vector-icons/Entypo';
import {useState} from 'react';
import AppLink from '@ui/AppLink';
import AuthFormContainer from '@components/AuthFormContainer';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {AuthStackParamList} from 'src/@types/navigation';
import {FormikHelpers} from 'formik';
import client from 'src/api/client';
import {useDispatch} from 'react-redux';
import {updateLoggedInState, updateProfile} from 'src/store/authSlice';
import {Keys, saveToAsyncStorage} from '@utils/asyncStorage';
import {catchAsyncError} from 'src/api/catchError';
import {updateNotification} from 'src/store/notificationSlice';

const signInSchema = yup.object({
  email: yup
    .string()
    .email('Invalid email!')
    .trim('Email is missing!')
    .required('Email is required!'),
  password: yup
    .string()
    .trim('Password is missing!')
    .min(8, 'Password length must be 8 atleast')
    .required('Password is required!')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+-={}|;:,.<>?]).{8,32}$/,
      'Password should contain atleast one capital letter, numeric character and a special character',
    ),
});

interface SignInUserInfo {
  email: string;
  password: string;
}

const initialValues = {
  email: '',
  password: '',
};

const SignIn = () => {
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();

  const [rightIconName, setRightIconName] = useState<'eye' | 'eye-with-line'>(
    'eye',
  );
  const [busy, setBusy] = useState(false);

  const dispatch = useDispatch();

  const onRightIconPress = () => {
    if (rightIconName === 'eye') setRightIconName('eye-with-line');
    else setRightIconName('eye');
  };

  const handleSubmit = async (
    values: SignInUserInfo,
    actions: FormikHelpers<SignInUserInfo>,
  ) => {
    try {
      setBusy(true);

      const {data} = await client.post('/auth/sign-in', {...values});

      await saveToAsyncStorage(Keys.AUTH_TOKEN, data.token);

      dispatch(updateProfile(data.profile));
      dispatch(updateLoggedInState(true));
    } catch (error) {
      const errorMessage = catchAsyncError(error);

      dispatch(updateNotification({message: errorMessage, type: 'error'}));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Form
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={signInSchema}>
      <AuthFormContainer heading="Welcome back!">
        <View style={styles.formContainer}>
          <AuthInputField
            name="email"
            label="Email"
            placeholder="john@email.com"
            autoCapitalize="none"
            keyboardType="email-address"
            containerStyle={styles.marginBottom}
          />

          <AuthInputField
            name="password"
            label="Password"
            placeholder="********"
            autoCapitalize="none"
            secureTextEntry={rightIconName === 'eye' ? true : false}
            containerStyle={styles.marginBottom}
            rightIcon={
              <Icon name={rightIconName} color={colors.SECONDARY} size={19} />
            }
            onRightIconPress={onRightIconPress}
          />

          <SubmitBtn title="Sign In" busy={busy} />

          <View style={styles.flexContainer}>
            <AppLink
              title="Forgot my password"
              onPress={() => navigation.navigate('LostPassword')}
            />
            <AppLink
              title="I don't have an account"
              onPress={() => navigation.navigate('SignUp')}
            />
          </View>
        </View>
      </AuthFormContainer>
    </Form>
  );
};

export default SignIn;

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
