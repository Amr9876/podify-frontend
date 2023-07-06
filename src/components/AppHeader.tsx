import {useNavigation} from '@react-navigation/native';
import colors from '@utils/colors';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';

interface Props {
  title: string;
}

const AppHeader = ({title}: Props) => {
  const {goBack, canGoBack} = useNavigation();

  if (!canGoBack()) return;

  return (
    <View style={styles.container}>
      <Pressable onPress={goBack}>
        <AntDesignIcon name="arrowleft" size={24} color={colors.CONTRAST} />
      </Pressable>

      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

export default AppHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: colors.CONTRAST,
    fontSize: 18,
    fontWeight: '700',
  },
});
