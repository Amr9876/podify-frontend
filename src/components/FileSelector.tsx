import {ReactNode} from 'react';
import colors from '@utils/colors';
import {
  View,
  Pressable,
  StyleSheet,
  Text,
  StyleProp,
  ViewStyle,
} from 'react-native';
import DocumentPicker, {
  DocumentPickerResponse,
  DocumentPickerOptions,
} from 'react-native-document-picker';
import {SupportedPlatforms} from 'react-native-document-picker/lib/typescript/fileTypes';

interface Props {
  icon: ReactNode;
  btnTitle: string;
  style: StyleProp<ViewStyle>;
  onSelect: (file: DocumentPickerResponse) => void;
  options: DocumentPickerOptions<SupportedPlatforms>;
}

const FileSelector = ({icon, btnTitle, style, onSelect}: Partial<Props>) => {
  const handleDocumentSelect = async () => {
    try {
      const document = await DocumentPicker.pick();
      const file = document[0];

      onSelect && onSelect(file);
    } catch (error) {
      if (!DocumentPicker.isCancel(error)) {
        console.log({error});
      }
    }
  };

  return (
    <Pressable
      onPress={handleDocumentSelect}
      style={[styles.btnContainer, style]}>
      <View style={styles.iconContainer}>{icon}</View>
      <Text style={styles.btnTitle}>{btnTitle}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  btnContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    height: 70,
    aspectRatio: 1,
    borderWidth: 2,
    borderColor: colors.SECONDARY,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnTitle: {
    color: colors.CONTRAST,
    marginTop: 5,
  },
});

export default FileSelector;
