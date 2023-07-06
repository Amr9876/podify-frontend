import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import PulseAnimationContainer from './PulseAnimationContainer';
import colors from '@utils/colors';

interface Props {
  items?: number;
}

const AudioListLoadingUI = ({items = 8}: Props) => {
  const dummyData = new Array(items).fill('');

  return (
    <PulseAnimationContainer>
      {dummyData.map((_, index) => (
        <View key={index} style={styles.dummyListItem} />
      ))}
    </PulseAnimationContainer>
  );
};

const styles = StyleSheet.create({
  dummyListItem: {
    height: 50,
    width: '100%',
    backgroundColor: colors.INACTIVE_CONTRAST,
    borderRadius: 5,
    marginBottom: 15,
  },
});

export default AudioListLoadingUI;
