import colors from '@utils/colors';
import {FC} from 'react';
import {View, StyleSheet, Text, FlatList} from 'react-native';
import AppModal from './AppModal';
import {AudioData} from 'src/@types/audio';
import AudioListItem from './AudioListItem';
import AudioListLoadingUI from './AudioListLoadingUI';
import {useSelector} from 'react-redux';
import {getPlayerState} from 'src/store/playerSlice';

interface Props {
  header?: string;
  visible: boolean;
  data: AudioData[];
  loading?: boolean;
  onRequestClose(): void;
  onItemPress: (item: AudioData, data: AudioData[]) => void;
}

const AudioListModal: FC<Props> = ({
  header,
  visible,
  data,
  loading,
  onRequestClose,
  onItemPress,
}) => {
  const {onGoingAudio} = useSelector(getPlayerState);

  return (
    <AppModal visible={visible} onRequestClose={onRequestClose}>
      <View style={styles.container}>
        {loading ? (
          <AudioListLoadingUI />
        ) : (
          <>
            <Text style={styles.header}>{header}</Text>
            <FlatList
              data={data}
              keyExtractor={item => item.id}
              renderItem={({item}) => (
                <AudioListItem
                  onPress={() => onItemPress(item, data)}
                  isPlaying={onGoingAudio?.id === item.id}
                  audio={item}
                />
              )}
            />
          </>
        )}
      </View>
    </AppModal>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.CONTRAST,
    paddingVertical: 10,
  },
});

export default AudioListModal;