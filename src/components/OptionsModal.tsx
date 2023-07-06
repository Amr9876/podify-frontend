import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import BasicModalContainer from '@ui/BasicModalContainer';

interface Props<T> {
  visible: boolean;
  options: T[];
  onRequestClose: () => void;
  renderItem: (item: T) => JSX.Element;
}

const OptionsModal = <T extends any>({
  visible,
  options,
  onRequestClose,
  renderItem,
}: Props<T>) => {
  return (
    <BasicModalContainer visible={visible} onRequestClose={onRequestClose}>
      {options.map((item, index) => (
        <View key={index}>{renderItem(item)}</View>
      ))}
    </BasicModalContainer>
  );
};

export default OptionsModal;

const styles = StyleSheet.create({});
