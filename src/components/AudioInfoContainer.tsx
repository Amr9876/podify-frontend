import AppLink from '@ui/AppLink';
import colors from '@utils/colors';
import {Dispatch, SetStateAction} from 'react';
import {Pressable, ScrollView} from 'react-native';
import {StyleSheet, Text, View} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useSelector} from 'react-redux';
import {getPlayerState} from 'src/store/playerSlice';

interface Props {
  visible: boolean;
  closeHandler: Dispatch<SetStateAction<boolean>>;
}

const AudioInfoContainer = ({visible, closeHandler}: Props) => {
  if (!visible) return;

  const {onGoingAudio} = useSelector(getPlayerState);

  const handleClose = () => closeHandler(false);

  return (
    <View style={styles.container}>
      <Pressable style={styles.closeButton} onPress={handleClose}>
        <AntDesign name="close" size={24} color={colors.CONTRAST} />
      </Pressable>
      <ScrollView>
        <View>
          <Text style={styles.title}>{onGoingAudio?.title}</Text>

          <View style={styles.ownerInfo}>
            <Text style={styles.title}>Creator: </Text>
            <AppLink title={onGoingAudio?.owner.name} />
          </View>

          <Text style={styles.about}>{onGoingAudio?.about}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default AudioInfoContainer;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.PRIMARY,
    zIndex: 1,
    padding: 10,
  },
  title: {
    color: colors.CONTRAST,
    fontSize: 18,
    fontWeight: 'bold',
    paddingVertical: 5,
  },
  about: {
    color: colors.CONTRAST,
    fontSize: 16,
    paddingVertical: 5,
  },
  closeButton: {
    alignSelf: 'flex-end',
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ownerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
