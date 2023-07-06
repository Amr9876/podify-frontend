import {StyleSheet, TextInput, TextInputProps} from 'react-native';
import {FC} from 'react';
import colors from '@utils/colors';

interface Props extends TextInputProps {}

const AppInput: FC<Props> = props => {
  return (
    <TextInput
      {...props}
      style={[styles.input, props.style]}
      placeholderTextColor={colors.INACTIVE_CONTRAST}
    />
  );
};

export default AppInput;

const styles = StyleSheet.create({
  input: {
    borderWidth: 2,
    borderColor: colors.SECONDARY,
    height: 60,
    borderRadius: 8,
    color: colors.CONTRAST,
    margin: 10,
    padding: 10,
  },
});
