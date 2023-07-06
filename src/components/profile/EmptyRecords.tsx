import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import colors from '@utils/colors';

interface Props {
  title: string;
}

const EmptyRecords = ({title}: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

export default EmptyRecords;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: colors.INACTIVE_CONTRAST,
  },
});
