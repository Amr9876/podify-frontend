import {StyleSheet, Text, TextInput, View} from 'react-native';
import {useState, useEffect} from 'react';
import AppHeader from '@components/AppHeader';
import colors from '@utils/colors';
import AvatarField from '@ui/AvatarField';
import {Pressable} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import AppButton from '@ui/AppButton';
import {useDispatch, useSelector} from 'react-redux';
import {catchAsyncError} from 'src/api/catchError';
import {updateNotification} from 'src/store/notificationSlice';
import {getClient} from 'src/api/client';
import {
  Keys,
  getFromAsyncStorage,
  removeFromAsyncStorage,
  saveToAsyncStorage,
} from '@utils/asyncStorage';
import {
  getAuthState,
  updateBusyState,
  updateLoggedInState,
  updateProfile,
} from 'src/store/authSlice';
import deepEqual from 'deep-equal';
import ImagePicker from 'react-native-image-crop-picker';
import {getPermissionsToReadImages} from '@utils/helper';
import ReverificationLink from '@components/ReverificationLink';
import {Alert} from 'react-native';
import {useQueryClient} from 'react-query';

interface ProfileInfo {
  name: string;
  avatar?: string;
}

const ProfileSettings = () => {
  const [userInfo, setUserInfo] = useState<ProfileInfo>({name: ''});
  const [busy, setBusy] = useState(false);
  const [isHistoryDisabled, setIsHistoryDisabled] = useState(false);

  const dispatch = useDispatch();
  const {profile} = useSelector(getAuthState);
  const queryClient = useQueryClient();

  const isSame = deepEqual(userInfo, {
    name: profile?.name,
    avatar: profile?.avatar,
  });

  const handleLogout = async (fromAll?: boolean) => {
    dispatch(updateBusyState(true));

    try {
      const endpoint = `/auth/log-out?fromAll=${fromAll ? 'yes' : ''}`;

      const client = await getClient();

      await client.post(endpoint);

      await removeFromAsyncStorage(Keys.AUTH_TOKEN);

      dispatch(updateProfile(null));
      dispatch(updateLoggedInState(false));
    } catch (error) {
      const errorMessage = catchAsyncError(error);

      dispatch(updateNotification({message: errorMessage, type: 'error'}));
    } finally {
      dispatch(updateBusyState(false));
    }
  };

  const handleSave = async () => {
    setBusy(true);

    if (!userInfo.name.trim()) {
      dispatch(
        updateNotification({
          message: 'Profile name is required!',
          type: 'error',
        }),
      );
      return;
    }

    try {
      const formData = new FormData();

      formData.append('name', userInfo.name);

      if (userInfo.avatar) {
        formData.append('avatar', {
          name: 'avatar',
          type: 'image/*',
          uri: userInfo.avatar,
        });
      }

      const client = await getClient({'Content-Type': 'multipart/form-data'});

      const {data} = await client.post('/auth/update-profile', formData);

      dispatch(updateProfile(data.profile));
      setUserInfo({name: data.profile.name, avatar: data.profile.avatar});

      dispatch(
        updateNotification({
          message: 'Your profile is updated!',
          type: 'success',
        }),
      );
    } catch (error) {
      const errorMessage = catchAsyncError(error);

      dispatch(updateNotification({message: errorMessage, type: 'error'}));
    } finally {
      setBusy(false);
    }
  };

  const handleImageSelect = async () => {
    try {
      await getPermissionsToReadImages();

      const {path} = await ImagePicker.openPicker({
        width: 300,
        height: 300,
        cropping: true,
      });

      setUserInfo({...userInfo, avatar: path});
    } catch (error) {
      console.log(error);
    }
  };

  const clearHistory = async () => {
    try {
      const client = await getClient();
      await client.delete('/history?all=yes');
      await queryClient.invalidateQueries({queryKey: ['histories']});

      dispatch(
        updateNotification({
          message: 'Your history is cleared!',
          type: 'success',
        }),
      );
    } catch (error) {
      const errorMessage = catchAsyncError(error);

      dispatch(updateNotification({message: errorMessage, type: 'error'}));
    }
  };

  const handleOnHistoryClear = () => {
    Alert.alert(
      'Are you sure?',
      'This action will clear out all your history.',
      [
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => clearHistory(),
        },
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => {},
        },
      ],
      {
        cancelable: true,
      },
    );
  };

  const handleOnHistoryDisable = async () => {
    await saveToAsyncStorage(Keys.DISABLE_HISTORY, 'true');

    setIsHistoryDisabled(false);

    dispatch(
      updateNotification({message: 'History Disabled', type: 'success'}),
    );
  };

  const handleOnHistoryEnable = async () => {
    await saveToAsyncStorage(Keys.DISABLE_HISTORY, 'false');

    setIsHistoryDisabled(true);

    dispatch(updateNotification({message: 'History Enabled', type: 'success'}));
  };

  useEffect(() => {
    if (profile) setUserInfo({name: profile.name, avatar: profile.avatar});

    (async () => {
      const historyDisabled = await getFromAsyncStorage(Keys.DISABLE_HISTORY);

      if (historyDisabled === 'true') {
        setIsHistoryDisabled(false);
      } else {
        setIsHistoryDisabled(true);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <AppHeader title="Settings" />

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Profile Settings</Text>
      </View>

      <View style={styles.settingOptionsContainer}>
        <View style={styles.avatarContainer}>
          <AvatarField source={userInfo.avatar} />

          <Pressable style={styles.paddingLeft} onPress={handleImageSelect}>
            <Text style={styles.linkText}>Update Profile Image</Text>
          </Pressable>
        </View>

        <TextInput
          onChangeText={text => setUserInfo({...userInfo, name: text})}
          value={userInfo.name}
          style={styles.nameInput}
        />

        <View style={styles.emailContainer}>
          <Text style={styles.email}>{profile?.email}</Text>

          {profile?.verified ? (
            <MaterialIcon name="verified" size={15} color={colors.SECONDARY} />
          ) : (
            <ReverificationLink linkTitle="verify" activeAtFirst />
          )}
        </View>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>History</Text>
      </View>

      <View style={styles.settingOptionsContainer}>
        <Pressable
          onPress={handleOnHistoryClear}
          style={styles.buttonContainer}>
          <MaterialComIcon name="broom" size={20} color={colors.CONTRAST} />
          <Text style={styles.buttonTitle}>Clear All</Text>
        </Pressable>

        <Pressable
          onPress={
            isHistoryDisabled ? handleOnHistoryEnable : handleOnHistoryDisable
          }
          style={styles.buttonContainer}>
          <MaterialComIcon
            name={isHistoryDisabled ? 'check-circle-outline' : 'block-helper'}
            size={20}
            color={colors.CONTRAST}
          />
          <Text style={styles.buttonTitle}>
            {isHistoryDisabled ? 'Enable' : 'Disable'}
          </Text>
        </Pressable>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Logout</Text>
      </View>

      <View style={styles.settingOptionsContainer}>
        <Pressable
          onPress={() => handleLogout(true)}
          style={styles.buttonContainer}>
          <AntDesign name="logout" size={20} color={colors.CONTRAST} />
          <Text style={styles.buttonTitle}>Logout From All</Text>
        </Pressable>

        <Pressable
          onPress={() => handleLogout()}
          style={styles.buttonContainer}>
          <AntDesign name="logout" size={20} color={colors.CONTRAST} />
          <Text style={styles.buttonTitle}>Logout</Text>
        </Pressable>
      </View>

      {!isSame && (
        <View style={styles.marginTop}>
          <AppButton title="Save" onPress={handleSave} isBusy={busy} />
        </View>
      )}
    </View>
  );
};

export default ProfileSettings;

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  titleContainer: {
    padding: 4,
    borderBottomColor: colors.SECONDARY,
    borderBottomWidth: 2,
    marginTop: 16,
  },
  title: {
    color: colors.SECONDARY,
    fontSize: 16,
    fontWeight: 'bold',
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkText: {
    color: colors.SECONDARY,
    fontStyle: 'italic',
  },
  paddingLeft: {
    paddingLeft: 15,
  },
  settingOptionsContainer: {
    width: '100%',
    marginTop: 16,
    marginLeft: 16,
    alignItems: 'flex-start',
  },
  nameInput: {
    color: colors.CONTRAST,
    fontWeight: 'bold',
    fontSize: 18,
    padding: 10,
    borderWidth: 0.5,
    borderColor: colors.CONTRAST,
    borderRadius: 7,
    marginTop: 15,
    width: 300,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    columnGap: 10,
  },
  email: {
    color: colors.CONTRAST,
    marginRight: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  buttonTitle: {
    color: colors.CONTRAST,
    fontSize: 18,
    marginLeft: 5,
  },
  marginTop: {
    marginTop: 15,
  },
});
