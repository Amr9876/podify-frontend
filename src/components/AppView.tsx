import {StyleSheet, View} from 'react-native';
import React, {PropsWithChildren} from 'react';
import MiniAudioPlayer from './MiniAudioPlayer';
import {useAudioController} from 'src/hooks/useAudioController';
import PlaylistAudioModal from './PlaylistAudioModal';

interface Props extends PropsWithChildren {}

const AppView = ({children}: Props) => {
  const {isPlayerReady} = useAudioController();

  return (
    <View style={styles.container}>
      <View style={styles.children}>{children}</View>
      {isPlayerReady && <MiniAudioPlayer />}
      <PlaylistAudioModal />
    </View>
  );
};

export default AppView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  children: {
    flex: 1,
  },
});
