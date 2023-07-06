import ProfileSettings from '@components/profile/ProfileSettings';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from '@views/Home';
import Profile from '@views/Profile';
import PublicProfile from '@views/PublicProfile';
import {StyleSheet} from 'react-native';
import {HomeNavigatorStackParamList} from 'src/@types/navigation';

const Stack = createNativeStackNavigator<HomeNavigatorStackParamList>();

const HomeNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="PublicProfile" component={PublicProfile} />
      <Stack.Screen name="Profile" component={Profile} />
    </Stack.Navigator>
  );
};

export default HomeNavigator;

const styles = StyleSheet.create({});
