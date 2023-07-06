import AvatarField from '@ui/AvatarField';
import colors from '@utils/colors';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useMutation, useQueryClient} from 'react-query';
import {useDispatch} from 'react-redux';
import {PublicProfile} from 'src/@types/user';
import {catchAsyncError} from 'src/api/catchError';
import {getClient} from 'src/api/client';
import {useFetchIsFollowing} from 'src/hooks/query';
import {updateNotification} from 'src/store/notificationSlice';

interface Props {
  profile?: PublicProfile;
}

const PublicProfileContainer = ({profile}: Props) => {
  const {data: isFollowing} = useFetchIsFollowing(profile?.id || '');
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const followingMutation = useMutation({
    mutationFn: async id => toggleFollowing(id),
    onMutate: (id: string) => {
      queryClient.setQueryData<boolean>(['is-following', id], prev => !prev);
    },
  });

  const toggleFollowing = async (id: string) => {
    try {
      if (!id) return;

      const client = await getClient();

      await client.post('/profile/update-follower/' + id);

      await queryClient.invalidateQueries({queryKey: ['profile', id]});
    } catch (error) {
      const errorMessage = catchAsyncError(error);

      dispatch(updateNotification({message: errorMessage, type: 'error'}));
    }
  };

  if (!profile) return;

  return (
    <View style={styles.container}>
      <AvatarField source={profile.avatar} />

      <View style={{marginLeft: 10}}>
        <Text style={styles.profileName}>{profile.name}</Text>
        <Text style={styles.followerText}>{profile.followers} Followers</Text>

        <Pressable
          onPress={() => followingMutation.mutate(profile.id)}
          style={styles.flexRow}>
          <Text style={styles.profileActionLink}>
            {isFollowing ? 'unfollow' : 'follow'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default PublicProfileContainer;

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
    marginRight: 5,
    marginVertical: 5,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileActionLink: {
    backgroundColor: colors.SECONDARY,
    color: colors.PRIMARY,
    paddingHorizontal: 4,
    paddingVertical: 2,
    margin: 5,
    borderRadius: 2,
    marginTop: 5,
  },
  followerText: {
    color: colors.CONTRAST,
    paddingVertical: 2,
    marginTop: 5,
  },
  settingsBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
