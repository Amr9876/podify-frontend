import {FlatList, Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useFetchRecommendedPlaylist} from 'src/hooks/query';
import colors from '@utils/colors';
import {Playlist} from 'src/@types/audio';

interface Props {
  onListPress: (playlist: Playlist) => void;
}

const RecommendedPlaylist = ({onListPress}: Props) => {
  const {data, isLoading, isFetching} = useFetchRecommendedPlaylist();

  if (!data?.length || !data || isFetching || isLoading) return;

  return (
    <View>
      <Text style={styles.header}>Playlist for you</Text>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={data}
        renderItem={({item, index}) => (
          <Pressable
            key={index}
            onPress={() => onListPress(item)}
            style={styles.container}>
            <Image
              source={require('../assets/music.png')}
              style={styles.image}
            />
            <View style={styles.overlay}>
              <Text numberOfLines={2} style={styles.title}>
                {item.title}
              </Text>
              <Text
                style={[styles.title, {color: '#aaa', textShadowRadius: 10}]}>
                {item.itemsCount} {item.itemsCount > 1 ? 'audios' : 'audio'}
              </Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
};

export default RecommendedPlaylist;

const cardSize = 150;

const styles = StyleSheet.create({
  container: {
    width: cardSize,
    marginRight: 15,
    overflow: 'hidden',
  },
  image: {
    width: cardSize,
    height: cardSize,
    borderRadius: 5,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.OVERLAY,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  title: {
    color: colors.CONTRAST,
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
  },
  header: {
    color: colors.CONTRAST,
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 15,
  },
});
