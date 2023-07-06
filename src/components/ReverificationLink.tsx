import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import AppLink from '@ui/AppLink';
import colors from '@utils/colors';
import {getClient} from 'src/api/client';
import {useSelector} from 'react-redux';
import {getAuthState} from 'src/store/authSlice';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ProfileNavigatorStackParamList} from 'src/@types/navigation';

interface Props {
  time?: number;
  activeAtFirst?: boolean;
  linkTitle: string;
  userId?: string;
}

type NavigationProps = NativeStackNavigationProp<
  ProfileNavigatorStackParamList,
  'ProfileSettings'
>;

const ReverificationLink = ({
  time = 60,
  activeAtFirst = false,
  linkTitle,
  userId,
}: Props) => {
  const [countDown, setCountDown] = useState(time);
  const [canSendNewOTPRequest, setCanSendNewOTPRequest] =
    useState(activeAtFirst);

  const {profile} = useSelector(getAuthState);

  const {navigate} = useNavigation<NavigationProps>();

  useEffect(() => {
    if (canSendNewOTPRequest) return;

    const intervalId = setInterval(() => {
      setCountDown(prev => {
        if (prev <= 0) {
          setCanSendNewOTPRequest(true);
          clearInterval(intervalId);

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [canSendNewOTPRequest]);

  const requestForOTP = async () => {
    setCountDown(30);
    setCanSendNewOTPRequest(false);

    try {
      const client = await getClient();

      await client.post('/auth/re-verify-email', {
        userId: userId || profile?.id,
      });

      navigate('Verification', {
        userInfo: {
          id: userId || profile?.id || '',
          email: profile?.email || '',
          name: profile?.name || '',
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      {countDown > 0 && !canSendNewOTPRequest && (
        <Text style={styles.countDown}>{countDown} sec</Text>
      )}
      <AppLink
        title={linkTitle}
        onPress={requestForOTP}
        active={canSendNewOTPRequest}
      />
    </View>
  );
};

export default ReverificationLink;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countDown: {
    color: colors.SECONDARY,
    marginRight: 7,
  },
});
