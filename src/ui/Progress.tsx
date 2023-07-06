import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import colors from '@utils/colors';

interface Props {
  progress: number;
}

const Progress = ({progress}: Props) => {
  return (
    <>
      <Text style={styles.title}>{progress}%</Text>
      <View style={[styles.progressBar, {width: `${progress}%`}]} />
    </>
  );
};

export default Progress;

const styles = StyleSheet.create({
  title: {
    color: colors.CONTRAST,
    paddingVertical: 2,
    alignSelf: 'flex-end',
  },
  progressBar: {
    height: 10,
    backgroundColor: colors.CONTRAST,
    borderRadius: 5,
  },
});
