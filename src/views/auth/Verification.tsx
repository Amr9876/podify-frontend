import {Keyboard, StyleSheet, View} from 'react-native';
import AuthFormContainer from '@components/AuthFormContainer';
import OTPField from '@ui/OTPField';
import AppButton from '@ui/AppButton';
import {useEffect, useRef, useState} from 'react';
import {TextInput} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  AuthStackParamList,
  ProfileNavigatorStackParamList,
} from 'src/@types/navigation';
import client from 'src/api/client';
import {useDispatch} from 'react-redux';
import {catchAsyncError} from 'src/api/catchError';
import {updateNotification} from 'src/store/notificationSlice';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import ReverificationLink from '@components/ReverificationLink';

type Props = NativeStackScreenProps<
  AuthStackParamList | ProfileNavigatorStackParamList,
  'Verification'
>;
type PossibleScreens = {
  SignIn: undefined;
  ProfileSettings: undefined;
};

const otpFields = new Array(6).fill('');

const Verification = ({route}: Props) => {
  const [otp, setOtp] = useState([...otpFields]);
  const [activeOtpIndex, setActiveOtpIndex] = useState(0);
  const [busy, setBusy] = useState(false);
  const [canSendNewOTPRequest, setCanSendNewOTPRequest] = useState(false);

  const inputRef = useRef<TextInput>(null);

  const {userInfo} = route.params;

  const dispatch = useDispatch();

  const navigation = useNavigation<NavigationProp<PossibleScreens>>();

  const handleChange = (value: string, index: number) => {
    const newOtp = [...otp];

    if (value === 'Backspace') {
      if (!newOtp[index]) setActiveOtpIndex(index - 1);

      newOtp[index] = '';
    } else {
      setActiveOtpIndex(index + 1);
      newOtp[index] = value;
    }

    setOtp([...newOtp]);
  };

  const handlePaste = (value: string) => {
    if (value.length === 6) {
      Keyboard.dismiss();

      const newOtp = value.split('');

      setOtp([...newOtp]);
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOtpIndex]);

  const isValidOTP = otp.every(value => value.trim());

  const handleSubmit = async () => {
    if (!isValidOTP)
      return dispatch(
        updateNotification({message: 'Invalid OTP!', type: 'error'}),
      );

    try {
      setBusy(true);
      console.log(otp.join(''));

      const {data} = await client.post('/auth/verify-email', {
        userId: userInfo.id,
        token: otp.join(''),
      });

      dispatch(updateNotification({message: data.message, type: 'success'}));

      const {routeNames} = navigation.getState();

      if (routeNames.includes('SignIn')) navigation.navigate('SignIn');

      if (routeNames.includes('ProfileSettings'))
        navigation.navigate('ProfileSettings');
    } catch (error) {
      const errorMessage = catchAsyncError(error);

      dispatch(updateNotification({message: errorMessage, type: 'error'}));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthFormContainer
      heading="Verify Email"
      subHeading="Please check your inbox.">
      <View style={styles.inputContainer}>
        {otpFields.map((_, index) => (
          <OTPField
            ref={activeOtpIndex === index ? inputRef : null}
            key={index}
            placeholder="*"
            onKeyPress={({nativeEvent}) => handleChange(nativeEvent.key, index)}
            keyboardType="numeric"
            maxLength={1}
            value={otp[index] || ''}
            onChangeText={handlePaste}
          />
        ))}
      </View>

      <AppButton title="Submit" onPress={handleSubmit} isBusy={busy} />

      <View style={styles.linkContainer}>
        <ReverificationLink linkTitle="Resend OTP" userId={userInfo.id} />
      </View>
    </AuthFormContainer>
  );
};

export default Verification;

const styles = StyleSheet.create({
  inputContainer: {
    width: '95%',
    flexDirection: 'row',
    marginBottom: 19,
    justifyContent: 'space-between',
  },
  linkContainer: {
    width: '90%',
    justifyContent: 'flex-end',
    marginTop: 20,
    flexDirection: 'row',
  },
});
