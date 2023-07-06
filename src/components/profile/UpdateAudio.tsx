import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ProfileNavigatorStackParamList} from 'src/@types/navigation';
import AudioForm from '@components/form/AudioForm';
import {useDispatch} from 'react-redux';
import {getClient} from 'src/api/client';
import {mapRange} from '@utils/math';
import {catchAsyncError} from 'src/api/catchError';
import {updateNotification} from 'src/store/notificationSlice';
import {useQueryClient} from 'react-query';
import {NavigationProp, useNavigation} from '@react-navigation/native';

type Props = NativeStackScreenProps<
  ProfileNavigatorStackParamList,
  'UpdateAudio'
>;

const UpdateAudio = ({route}: Props) => {
  const {audio} = route.params;
  const initialValues = {
    title: audio.title,
    about: audio.about,
    category: audio.category,
  };

  const [uploadProgress, setUploadProgress] = useState(0);
  const [busy, setBusy] = useState(false);

  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const {navigate} =
    useNavigation<NavigationProp<ProfileNavigatorStackParamList>>();

  const handleUpload = async (formData: FormData) => {
    setBusy(true);

    try {
      const client = await getClient({
        'Content-Type': 'multipart/form-data',
      });

      await client.patch('/audio/' + audio.id, formData, {
        onUploadProgress: progressEvent => {
          const uploaded = mapRange({
            inputMin: 0,
            inputMax: progressEvent.total || 0,
            outputMin: 0,
            outputMax: 100,
            inputValue: progressEvent.loaded,
          });

          if (uploaded >= 100) {
            setBusy(false);
          }

          setUploadProgress(Math.floor(uploaded));
        },
      });

      await queryClient.invalidateQueries({queryKey: ['uploads-by-profile']});
      navigate('Profile');
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      dispatch(updateNotification({message: errorMessage, type: 'error'}));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AudioForm
      initialValues={initialValues}
      onSubmit={handleUpload}
      progress={uploadProgress}
      busy={busy}
    />
  );
};

export default UpdateAudio;

const styles = StyleSheet.create({});
