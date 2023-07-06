import {ScrollView, Text, View} from 'react-native';
import React, {useState} from 'react';
import {useFetchUploadsByProfile} from 'src/hooks/query';
import {StyleSheet} from 'react-native';
import AudioListItem from '@ui/AudioListItem';
import AudioListLoadingUI from '@ui/AudioListLoadingUI';
import EmptyRecords from './EmptyRecords';
import {useAudioController} from 'src/hooks/useAudioController';
import {getPlayerState} from 'src/store/playerSlice';
import {useSelector} from 'react-redux';
import {AudioData} from 'src/@types/audio';
import OptionsModal from '@components/OptionsModal';
import {Pressable} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import colors from '@utils/colors';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {ProfileNavigatorStackParamList} from 'src/@types/navigation';

const UploadTab = () => {
  const [showOptions, setShowOptions] = useState(false);
  const [selectedAudio, setSelectedAudio] = useState<AudioData>();

  const {onGoingAudio} = useSelector(getPlayerState);
  const {onAudioPress} = useAudioController();
  const {data, isLoading} = useFetchUploadsByProfile();
  const {navigate} =
    useNavigation<NavigationProp<ProfileNavigatorStackParamList>>();

  if (isLoading) return <AudioListLoadingUI />;

  if (!data?.length) return <EmptyRecords title="There is no audio!" />;

  const handleOnLongPress = (audio: AudioData) => {
    setSelectedAudio(audio);
    setShowOptions(true);
  };

  const handleOnEditPress = () => {
    setShowOptions(false);

    if (selectedAudio) navigate('UpdateAudio', {audio: selectedAudio});
  };

  return (
    <>
      <ScrollView style={styles.container}>
        {data &&
          data.map((item, i) => (
            <AudioListItem
              key={i}
              onPress={() => onAudioPress(item, data)}
              onLongPress={() => handleOnLongPress(item)}
              audio={item}
              isPlaying={onGoingAudio?.id === item.id}
            />
          ))}
      </ScrollView>

      <OptionsModal
        options={[
          {
            title: 'Edit',
            icon: 'edit',
            onPress: handleOnEditPress,
          },
        ]}
        renderItem={item => (
          <Pressable
            onPress={item.onPress}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 10,
            }}>
            <AntDesign color={colors.PRIMARY} name={item.icon} size={24} />
            <Text style={{color: colors.PRIMARY, fontSize: 16, marginLeft: 5}}>
              {item.title}
            </Text>
          </Pressable>
        )}
        visible={showOptions}
        onRequestClose={() => setShowOptions(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default UploadTab;
