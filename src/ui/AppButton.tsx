import {Pressable, StyleSheet, Text} from 'react-native';
import React, {FC} from 'react';
import colors from '@utils/colors';
import Loader from './Loader';

interface Props {
  title: string;
  onPress?(): void;
  isBusy?: boolean;
}

const AppButton: FC<Props> = ({title, onPress, isBusy}) => {
  return (
    <Pressable style={styles.container} onPress={!isBusy ? onPress : null}>
      {!isBusy ? <Text style={styles.title}>{title}</Text> : <Loader />}
    </Pressable>
  );
};

export default AppButton;

const styles = StyleSheet.create({
  container: {
    width: '95%',
    height: 60,
    backgroundColor: colors.SECONDARY,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  title: {
    color: colors.CONTRAST,
    fontSize: 20,
    fontWeight: 'bold',
  },
});
