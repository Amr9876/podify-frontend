import {StyleSheet, Text} from 'react-native';
import {useEffect} from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useDispatch, useSelector} from 'react-redux';
import {
  getNotificationState,
  updateNotification,
} from 'src/store/notificationSlice';
import colors from '@utils/colors';

const AppNotification = () => {
  const {message, type} = useSelector(getNotificationState);
  const height = useSharedValue(0);

  const dispatch = useDispatch();

  const heightStyle = useAnimatedStyle(() => ({
    height: height.value,
  }));

  let backgroundColor = colors.ERROR;
  let textColor = colors.CONTRAST;

  switch (type) {
    case 'success':
      backgroundColor = colors.SUCCESS;
      textColor = colors.PRIMARY;
      break;
  }

  useEffect(() => {
    let timeoutId = 0;

    const performAnimation = () => {
      height.value = withTiming(45, {
        duration: 150,
      });

      timeoutId = setTimeout(() => {
        height.value = withTiming(0, {
          duration: 150,
        });

        dispatch(updateNotification({message: '', type}));
      }, 3000);
    };

    if (message) performAnimation();

    return () => clearTimeout(timeoutId);
  }, [message]);

  return (
    <Animated.View style={[styles.container, {backgroundColor}, heightStyle]}>
      <Text style={[styles.message, {color: textColor}]}>{message}</Text>
    </Animated.View>
  );
};

export default AppNotification;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    fontSize: 18,
    alignItems: 'center',
  },
});
