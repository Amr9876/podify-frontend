import AudioListModal from '@ui/AudioListModal';
import {FC} from 'react';
import {StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {useAudioController} from 'src/hooks/useAudioController';
import {getPlayerState} from 'src/store/playerSlice';

interface Props {
  visible: boolean;
  onRequestClose(): void;
}

const CurrentAudioList: FC<Props> = ({visible, onRequestClose}) => {
  const {onGoingList} = useSelector(getPlayerState);
  const {onAudioPress} = useAudioController();

  return (
    <AudioListModal
      visible={visible}
      onRequestClose={onRequestClose}
      onItemPress={onAudioPress}
      data={onGoingList}
      header="Audios on the way"
    />
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default CurrentAudioList;
