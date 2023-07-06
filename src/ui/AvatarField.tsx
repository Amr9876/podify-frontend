import colors from '@utils/colors';
import {Image, StyleSheet, View} from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';

interface Props {
  source?: string;
}

const avatarSize = 70;

const AvatarField = ({source}: Props) => {
  return (
    <View>
      {source ? (
        <Image source={{uri: source}} style={styles.avatarImage} />
      ) : (
        <View style={styles.avatarImage}>
          <EntypoIcon name="mic" size={30} color={colors.PRIMARY} />
        </View>
      )}
    </View>
  );
};

export default AvatarField;

const styles = StyleSheet.create({
  avatarImage: {
    width: avatarSize,
    height: avatarSize,
    borderRadius: avatarSize / 2,
    backgroundColor: colors.SECONDARY,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: colors.CONTRAST,
  },
});
