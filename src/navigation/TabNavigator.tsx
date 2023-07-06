import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import colors from '@utils/colors';
import Upload from '@views/Upload';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import ProfileNavigator from './ProfileNavigator';
import HomeNavigator from './HomeNavigator';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const getTabBarIcon = (
    props: {
      focused: boolean;
      color: string;
      size: number;
    },
    name: string,
    iconType: 'AntDesign' | 'MaterialCommunityIcon',
  ) => {
    const iconProps = {name, size: props.size, color: props.color};
    return iconType === 'AntDesign' ? (
      <AntDesign {...iconProps} />
    ) : (
      <MaterialComIcon {...iconProps} />
    );
  };

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.PRIMARY,
        },
      }}>
      <Tab.Screen
        name="HomeNavigator"
        component={HomeNavigator}
        options={{
          tabBarIcon: props => getTabBarIcon(props, 'home', 'AntDesign'),
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="Upload"
        component={Upload}
        options={{
          tabBarIcon: props =>
            getTabBarIcon(
              props,
              'account-music-outline',
              'MaterialCommunityIcon',
            ),
          tabBarLabel: 'Upload',
        }}
      />
      <Tab.Screen
        name="ProfileNavigator"
        component={ProfileNavigator}
        options={{
          tabBarIcon: props => getTabBarIcon(props, 'user', 'AntDesign'),
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
