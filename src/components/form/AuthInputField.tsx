import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import {FC, ReactNode} from 'react';
import AppInput from '@ui/AppInput';
import colors from '@utils/colors';
import {useFormikContext} from 'formik';

interface Props {
  name: string;
  placeholder: string;
  label: string;
  keyboardType: TextInputProps['keyboardType'];
  autoCapitalize: TextInputProps['autoCapitalize'];
  secureTextEntry: boolean;
  containerStyle: StyleProp<ViewStyle>;
  rightIcon: ReactNode;
  onRightIconPress: () => void;
}

const AuthInputField: FC<Partial<Props>> = ({
  name,
  placeholder,
  label,
  keyboardType,
  autoCapitalize,
  secureTextEntry,
  containerStyle,
  rightIcon,
  onRightIconPress,
}) => {
  const {handleChange, values, errors, touched, handleBlur} = useFormikContext<{
    [key: string]: string;
  }>();
  const errorMsg = touched[name!] && errors[name!] ? errors[name!] : '';

  return (
    <View style={containerStyle}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.errorMsg}>{errorMsg}</Text>
      </View>
      <AppInput
        placeholder={placeholder}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        secureTextEntry={secureTextEntry}
        onChangeText={handleChange(name)}
        onBlur={handleBlur(name!)}
        value={values[name!]}
      />

      {rightIcon && (
        <Pressable onPress={onRightIconPress} style={styles.rightIcon}>
          {rightIcon}
        </Pressable>
      )}
    </View>
  );
};

export default AuthInputField;

const styles = StyleSheet.create({
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 5,
  },
  label: {
    color: colors.CONTRAST,
  },
  errorMsg: {
    color: colors.ERROR,
    width: 300,
    textAlign: 'right',
  },
  rightIcon: {
    width: 60,
    height: 60,
    position: 'absolute',
    right: 10,
    bottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
