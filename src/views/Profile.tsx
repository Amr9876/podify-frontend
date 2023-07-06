import AppView from '@components/AppView';
import ProfileContainer from '@components/ProfileContainer';
import FavoriteTab from '@components/profile/FavoriteTab';
import HistoryTab from '@components/profile/HistoryTab';
import PlaylistTab from '@components/profile/PlaylistTab';
import UploadTab from '@components/profile/UploadTab';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import colors from '@utils/colors';
import {StyleSheet} from 'react-native';
import {View} from 'react-native';
import {useSelector} from 'react-redux';
import {getAuthState} from 'src/store/authSlice';

const Tab = createMaterialTopTabNavigator();

const Profile = () => {
  const {profile} = useSelector(getAuthState);

  return (
    <AppView>
      <View style={styles.container}>
        <ProfileContainer profile={profile} />
        <Tab.Navigator
          screenOptions={{
            tabBarStyle: styles.tabBarStyle,
            tabBarLabelStyle: styles.tabBarLabelStyle,
          }}>
          <Tab.Screen name="Uploads" component={UploadTab} />
          <Tab.Screen name="Playlist" component={PlaylistTab} />
          <Tab.Screen name="Favorites" component={FavoriteTab} />
          <Tab.Screen name="History" component={HistoryTab} />
        </Tab.Navigator>
      </View>
    </AppView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  tabBarStyle: {
    marginBottom: 20,
    backgroundColor: 'transparent',
    eleveation: 0,
    shadowRadius: 0,
    shadowColor: 'transparent',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0,
  },
  tabBarLabelStyle: {
    color: colors.CONTRAST,
    fontSize: 10,
  },
});

export default Profile;
