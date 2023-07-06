import AvatarField from '@ui/AvatarField';
import colors from '@utils/colors';
import {StyleSheet, Text, View} from 'react-native';
import {UserProfile} from 'src/store/authSlice';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import Octicons from 'react-native-vector-icons/Octicons';
import {Pressable} from 'react-native';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {ProfileNavigatorStackParamList} from 'src/@types/navigation';

interface Props {
  profile?: UserProfile | null;
}

const ProfileContainer = ({profile}: Props) => {
  if (!profile) return;

  const {navigate} =
    useNavigation<NavigationProp<ProfileNavigatorStackParamList>>();

  return (
    <View style={styles.container}>
      <AvatarField source={profile.avatar} />

      <View style={{marginLeft: 10}}>
        <Text style={styles.profileName}>{profile.name}</Text>

        <View style={styles.flexRow}>
          <Text style={styles.email}>{profile.email}</Text>

          {profile.verified ? (
            <MaterialIcon name="verified" size={15} color={colors.SECONDARY} />
          ) : (
            <Octicons name="unverified" size={15} color={colors.SECONDARY} />
          )}
        </View>

        <View style={styles.flexRow}>
          <Text style={styles.profileActionLink}>
            {profile.followers} Followers
          </Text>
          <Text style={styles.profileActionLink}>
            {profile.followings} Followings
          </Text>
        </View>
      </View>

      <Pressable
        onPress={() => navigate('ProfileSettings')}
        style={styles.settingsBtn}>
        <AntDesignIcon name="setting" size={22} color={colors.CONTRAST} />
      </Pressable>
    </View>
  );
};

export default ProfileContainer;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileName: {
    color: colors.CONTRAST,
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 3,
  },
  email: {
    color: colors.CONTRAST,
    marginLeft: 5,
    marginVertical: 5,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    columnGap: 5,
  },
  profileActionLink: {
    backgroundColor: 'transparent',
    color: colors.CONTRAST,
    paddingHorizontal: 4,
    paddingVertical: 2,
    margin: 5,
    borderRadius: 2,
  },
  settingsBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
