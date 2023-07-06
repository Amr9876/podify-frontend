import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
} from 'react-native';
import React from 'react';
import colors from '@utils/colors';

interface Props {
  title: string;
  onPress(): void;
  active: boolean;
  titleStyle?: StyleProp<TextStyle>;
}

const AppLink = ({
  title,
  onPress,
  active = true,
  titleStyle,
}: Partial<Props>) => {
  return (
    <Pressable
      onPress={active ? onPress : null}
      style={{opacity: active ? 1 : 0.4}}>
      <Text style={[styles.title, titleStyle]}>{title}</Text>
    </Pressable>
  );
};

export default AppLink;

const styles = StyleSheet.create({
  title: {
    color: colors.SECONDARY,
    fontSize: 12,
  },
});
