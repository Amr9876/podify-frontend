import {
  StyleSheet,
  Text,
  View,
  Modal,
  Pressable,
  ScrollView,
} from 'react-native';
import {JSX, useState} from 'react';
import colors from '@utils/colors';
import MaterialComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import BasicModalContainer from '@ui/BasicModalContainer';

interface Props<T> {
  data: T[];
  visible: boolean;
  title: string;
  renderItem: (item: T) => JSX.Element;
  onSelect: (item: T, index: number) => void;
  onRequestClose: () => void;
}

const CategorySelector = <T extends any>({
  visible = false,
  title,
  data,
  renderItem,
  onSelect,
  onRequestClose,
}: Props<T>) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleSelect = (item: T, index: number) => {
    setSelectedIndex(index);
    onSelect(item, index);
  };

  return (
    <BasicModalContainer {...{visible, onRequestClose}}>
      <Text>{title}</Text>

      <ScrollView>
        {data.map((item, index) => (
          <Pressable
            onPress={() => handleSelect(item, index)}
            key={index}
            style={styles.selectorContainer}>
            {selectedIndex === index ? (
              <MaterialComIcon
                name="radiobox-marked"
                color={colors.SECONDARY}
              />
            ) : (
              <MaterialComIcon name="radiobox-blank" color={colors.SECONDARY} />
            )}
            {renderItem(item)}
          </Pressable>
        ))}
      </ScrollView>
    </BasicModalContainer>
  );
};

export default CategorySelector;

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.PRIMARY,
    paddingVertical: 10,
  },
  selectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
