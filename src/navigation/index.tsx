import {useEffect} from 'react';
import {
  DefaultTheme,
  NavigationContainer,
  Theme,
} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {
  getAuthState,
  updateLoggedInState,
  updateProfile,
} from 'src/store/authSlice';
import TabNavigator from './TabNavigator';
import AuthNavigator from './AuthNavigator';
import {Keys, getFromAsyncStorage} from '@utils/asyncStorage';
import client from 'src/api/client';
import {View, StyleSheet} from 'react-native';
import Loader from '@ui/Loader';
import colors from '@utils/colors';
import {catchAsyncError} from 'src/api/catchError';
import {updateNotification} from 'src/store/notificationSlice';

const AppTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.PRIMARY,
    primary: colors.CONTRAST,
  },
};

const AppNavigator = () => {
  const {loggedIn, busy} = useSelector(getAuthState);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        const token = await getFromAsyncStorage(Keys.AUTH_TOKEN);

        if (!token) return;

        const {data} = await client.get('/auth/is-auth', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        dispatch(updateProfile(data.profile));
        dispatch(updateLoggedInState(true));
      } catch (error) {
        const errorMessage = catchAsyncError(error);

        dispatch(updateNotification({message: errorMessage, type: 'error'}));
      }
    })();
  }, []);

  return (
    <NavigationContainer theme={AppTheme}>
      {busy && (
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: colors.OVERLAY,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1,
          }}>
          <Loader />
        </View>
      )}
      {loggedIn ? <TabNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigator;
