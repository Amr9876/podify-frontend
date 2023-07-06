import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {Playlist} from 'src/@types/audio';
import MaterialComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import colors from '@utils/colors';

interface Props {
  playlist: Playlist;
  onPress?: () => void;
}

const PlaylistItem = ({playlist, onPress}: Props) => {
  const {title, itemsCount, visibility} = playlist;

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.posterContainer}>
        <MaterialComIcon
          name="playlist-music"
          size={30}
          color={colors.CONTRAST}
        />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        <View style={styles.iconContainer}>
          <FontAwesomeIcon
            name={visibility === 'public' ? 'globe' : 'lock'}
            size={15}
            color={colors.SECONDARY}
          />

          <Text style={styles.count}>
            {itemsCount} {itemsCount > 1 ? 'audios' : 'audios'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PlaylistItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    borderBottomWidth: 2,
    borderBottomColor: '#111',
    marginBottom: 15,
  },
  posterContainer: {
    backgroundColor: 'transparent',
    height: 50,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.CONTRAST,
  },
  count: {
    color: colors.SECONDARY,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  iconContainer: {
    flexDirection: 'row',
    paddingTop: 4,
  },
});
