import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import AppModal from '@ui/AppModal';
import {useSelector} from 'react-redux';
import {getPlayerState} from 'src/store/playerSlice';
import colors from '@utils/colors';
import AppLink from '@ui/AppLink';
import {useProgress} from 'react-native-track-player';
import formatDuration from 'format-duration';
import Slider from '@react-native-community/slider';
import {useAudioController} from 'src/hooks/useAudioController';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import PlayPauseBtn from '@ui/PlayPauseBtn';
import PlayerController from '@ui/PlayerController';
import Loader from '@ui/Loader';
import PlaybackRateSelector from '@ui/PlaybackRateSelector';
import AudioInfoContainer from './AudioInfoContainer';

interface Props {
  visible: boolean;
  onRequestClose: () => void;
  onListOptionPress: () => void;
  onProfileLinkPress: () => void;
}

const AudioPlayer = ({
  visible,
  onRequestClose,
  onListOptionPress,
  onProfileLinkPress,
}: Props) => {
  const [showAudioInfo, setShowAudioInfo] = useState(false);

  const {onGoingAudio, playbackRate} = useSelector(getPlayerState);
  const {duration, position} = useProgress();
  const {
    isPlaying,
    isBusy,
    seekTo,
    togglePlayPause,
    skipTo,
    onNextPress,
    onPreviousPress,
    setPlaybackRate,
  } = useAudioController();

  const source = onGoingAudio?.poster
    ? {uri: onGoingAudio.poster}
    : require('../assets/music.png');

  const updateSeek = async (value: number) => {
    await seekTo(value);
  };

  const handleSkipTo = async (skipType: 'forward' | 'backward') => {
    if (skipType === 'forward') await skipTo(10);
    if (skipType === 'backward') await skipTo(-10);
  };

  const handleOnNextPress = async () => await onNextPress();
  const handleOnPreviousPress = async () => await onPreviousPress();
  const handleOnPlaybackRatePress = async (rate: number) =>
    await setPlaybackRate(rate);

  return (
    <AppModal visible={visible} onRequestClose={onRequestClose} animation>
      <View style={styles.container}>
        <Pressable
          onPress={() => setShowAudioInfo(true)}
          style={styles.infoButton}>
          <AntDesign name="infocirlceo" size={24} color={colors.CONTRAST} />
        </Pressable>

        <AudioInfoContainer
          visible={showAudioInfo}
          closeHandler={setShowAudioInfo}
        />

        <Image source={source} style={styles.poster} />

        <View style={styles.contentContainer}>
          <Text style={styles.title}>{onGoingAudio?.title}</Text>

          <AppLink
            onPress={onProfileLinkPress}
            title={onGoingAudio?.owner.name || ''}
          />

          <View style={styles.durationContainer}>
            <Text style={styles.duration}>
              {formatDuration(position * 1000, {leading: true})}
            </Text>
            <Text style={styles.duration}>
              {formatDuration(duration * 1000, {leading: true})}
            </Text>
          </View>

          <Slider
            minimumValue={0}
            maximumValue={duration}
            minimumTrackTintColor={colors.CONTRAST}
            maximumTrackTintColor={colors.INACTIVE_CONTRAST}
            thumbTintColor={colors.CONTRAST}
            value={position}
            onSlidingComplete={updateSeek}
          />

          <View style={styles.controls}>
            <PlayerController onPress={handleOnPreviousPress}>
              <AntDesign
                name="stepbackward"
                size={24}
                color={colors.CONTRAST}
              />
            </PlayerController>

            <PlayerController onPress={() => handleSkipTo('backward')}>
              <FontAwesome
                name="rotate-left"
                size={18}
                color={colors.CONTRAST}
              />
              <Text style={styles.skipText}>-10s</Text>
            </PlayerController>

            <PlayerController ignoreContainer={false}>
              {isBusy ? (
                <Loader color={colors.PRIMARY} />
              ) : (
                <PlayPauseBtn
                  playing={isPlaying}
                  onPress={togglePlayPause}
                  color={colors.PRIMARY}
                />
              )}
            </PlayerController>

            <PlayerController onPress={() => handleSkipTo('forward')}>
              <FontAwesome
                name="rotate-right"
                size={18}
                color={colors.CONTRAST}
              />
              <Text style={styles.skipText}>+10s</Text>
            </PlayerController>

            <PlayerController onPress={handleOnNextPress}>
              <AntDesign name="stepforward" size={24} color={colors.CONTRAST} />
            </PlayerController>
          </View>

          <PlaybackRateSelector
            onPress={handleOnPlaybackRatePress}
            activeRate={playbackRate.toString()}
            containerStyle={{marginTop: 20}}
          />

          <View style={styles.listOptionBtnContainer}>
            <PlayerController onPress={onListOptionPress}>
              <MaterialComIcon
                name="playlist-music"
                size={24}
                color={colors.CONTRAST}
              />
            </PlayerController>
          </View>
        </View>
      </View>
    </AppModal>
  );
};

export default AudioPlayer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  poster: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.CONTRAST,
  },
  durationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  duration: {
    color: colors.CONTRAST,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  skipText: {
    fontSize: 12,
    marginTop: 2,
    color: colors.CONTRAST,
  },
  infoButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  listOptionBtnContainer: {
    alignItems: 'flex-end',
  },
});
