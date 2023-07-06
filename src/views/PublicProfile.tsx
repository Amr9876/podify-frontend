import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  HomeNavigatorStackParamList,
  PublicProfileTabParamList,
} from 'src/@types/navigation';
import AppView from '@components/AppView';
import {useFetchPublicProfile} from 'src/hooks/query';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import PublicProfileContainer from '@components/profile/PublicProfileContainer';
import PublicUploadsTab from '@components/profile/PublicUploadsTab';
import PublicPlaylistTab from '@components/profile/PublicPlaylistTab';
import colors from '@utils/colors';

type Props = NativeStackScreenProps<
  HomeNavigatorStackParamList,
  'PublicProfile'
>;

const Tab = createMaterialTopTabNavigator<PublicProfileTabParamList>();

const PublicProfile = ({route}: Props) => {
  const {profileId} = route.params;

  const {data} = useFetchPublicProfile(profileId);

  return (
    <AppView>
      <View style={styles.container}>
        <PublicProfileContainer profile={data} />

        <Tab.Navigator
          screenOptions={{
            tabBarStyle: styles.tabBarStyle,
            tabBarLabelStyle: styles.tabBarLabelStyle,
          }}>
          <Tab.Screen
            name="PublicUploads"
            component={PublicUploadsTab}
            options={{tabBarLabel: 'Uploads'}}
            initialParams={{profileId}}
          />
          <Tab.Screen
            name="PublicPlaylist"
            component={PublicPlaylistTab}
            options={{tabBarLabel: 'Playlist'}}
            initialParams={{profileId}}
          />
        </Tab.Navigator>
      </View>
    </AppView>
  );
};

export default PublicProfile;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
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
    fontSize: 12,
  },
});
