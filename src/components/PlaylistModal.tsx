import {Pressable, ScrollView, StyleSheet, Text} from 'react-native';
import React, {ReactNode} from 'react';
import BasicModalContainer from '@ui/BasicModalContainer';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import colors from '@utils/colors';
import {Playlist} from 'src/@types/audio';

interface Props {
  visible: boolean;
  list: Playlist[];
  onRequestClose?: () => void;
  onCreateNewPress?: () => void;
  onPlaylistPress: (item: Playlist) => void;
}

interface ListItemProps {
  icon: ReactNode;
  title: string;
  onPress?: () => void;
}

const ListItem = ({icon, title, onPress}: ListItemProps) => (
  <Pressable
    onPress={onPress}
    style={{flexDirection: 'row', alignItems: 'center', height: 45}}>
    {icon}

    <Text style={{fontSize: 16, color: colors.PRIMARY, marginLeft: 5}}>
      {title}
    </Text>
  </Pressable>
);

const PlaylistModal = ({
  list,
  visible,
  onRequestClose,
  onCreateNewPress,
  onPlaylistPress,
}: Props) => {
  return (
    <BasicModalContainer visible={visible} onRequestClose={onRequestClose}>
      <ScrollView>
        {list.map((item, i) => (
          <ListItem
            onPress={() => onPlaylistPress(item)}
            key={i}
            icon={
              <FontAwesomeIcon
                size={20}
                name={item.visibility === 'public' ? 'globe' : 'lock'}
                color={colors.PRIMARY}
              />
            }
            title={item.title}
          />
        ))}
      </ScrollView>

      <ListItem
        icon={<AntDesignIcon size={20} name="plus" color={colors.PRIMARY} />}
        title="Create New"
        onPress={onCreateNewPress}
      />
    </BasicModalContainer>
  );
};

export default PlaylistModal;

const styles = StyleSheet.create({});
