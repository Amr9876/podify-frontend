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
import {updateNotification} from 'src/store/notificationSlice';
import {catchAsyncError} from 'src/api/catchError';

interface NewUser {
  name: string;
  email: string;
  password: string;
}

const signUpSchema = yup.object({
  name: yup
    .string()
    .trim('Name is missing!')
    .min(3, 'Name must be atleast 3 characters')
    .required('Name is required!'),
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

const initialValues = {
  name: '',
  email: '',
  password: '',
};

const SignUp = () => {
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();
  const dispatch = useDispatch();

  const [rightIconName, setRightIconName] = useState<'eye' | 'eye-with-line'>(
    'eye',
  );
  const [busy, setBusy] = useState(false);

  const onRightIconPress = () => {
    if (rightIconName === 'eye') setRightIconName('eye-with-line');
    else setRightIconName('eye');
  };

  const handleSubmit = async (
    values: NewUser,
    actions: FormikHelpers<NewUser>,
  ) => {
    try {
      setBusy(true);
      const {data} = await client.post('/auth/create', {...values});

      console.log(data);

      navigation.navigate('Verification', {userInfo: data.user});
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
      validationSchema={signUpSchema}>
      <AuthFormContainer
        heading="Welcome!"
        subHeading="Let's get started by creating your account.">
        <View style={styles.formContainer}>
          <AuthInputField
            name="name"
            label="Name"
            placeholder="John Doe"
            containerStyle={styles.marginBottom}
          />

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

          <SubmitBtn title="Sign Up" busy={busy} />

          <View style={styles.flexContainer}>
            <AppLink
              title="Forgot my password"
              onPress={() => navigation.navigate('LostPassword')}
            />
            <AppLink
              title="I arleady have an account"
              onPress={() => navigation.navigate('SignIn')}
            />
          </View>
        </View>
      </AuthFormContainer>
    </Form>
  );
};

export default SignUp;

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
