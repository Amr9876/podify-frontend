import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useFetchHistories} from 'src/hooks/query';
import EmptyRecords from './EmptyRecords';
import AudioListLoadingUI from '@ui/AudioListLoadingUI';
import colors from '@utils/colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {getClient} from 'src/api/client';
import {useMutation, useQueryClient} from 'react-query';
import {History, HistoryAudio} from 'src/@types/audio';
import {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {RefreshControl} from 'react-native';

const HistoryTab = () => {
  const [selectedHistories, setSelectedHistories] = useState<string[]>([]);

  const {data, isLoading, isFetching} = useFetchHistories();
  const queryClient = useQueryClient();
  const navigation = useNavigation();

  const noData = !data?.length;

  const removeMutate = useMutation({
    mutationFn: async histories => removeHistories(histories),
    onMutate: (histories: string[]) => {
      queryClient.setQueryData<History[]>(['histories'], prev => {
        let newData: History[] = [];

        if (!prev) return newData;

        for (const data of prev) {
          const filteredData = data.audios.filter(
            item => !histories.includes(item.id),
          );

          if (filteredData.length) {
            newData.push({date: data.date, audios: filteredData});
          }
        }

        return newData;
      });
    },
  });

  const removeHistories = async (histories: string[]) => {
    const client = await getClient();

    await client.delete('/history?histories=' + JSON.stringify(histories));
    await queryClient.invalidateQueries({queryKey: ['histories']});
  };

  const handleSingleHistoryRemove = async (history: HistoryAudio) => {
    removeMutate.mutate([history.id]);
  };

  const handleMultipleHistoryRemove = async () => {
    removeMutate.mutate([...selectedHistories]);
    setSelectedHistories([]);
  };

  const handleOnLongPress = (history: HistoryAudio) => {
    setSelectedHistories([history.id]);
  };

  const handleOnPress = (history: HistoryAudio) => {
    setSelectedHistories(prev => {
      if (prev.includes(history.id)) {
        return prev.filter(item => item !== history.id);
      }
      return [...prev, history.id];
    });
  };

  const handleOnRefresh = async () => {
    await queryClient.invalidateQueries({queryKey: ['histories']});
  };

  useEffect(() => {
    const unselectHistories = () => setSelectedHistories([]);

    navigation.addListener('blur', unselectHistories);

    return () => {
      navigation.removeListener('blur', unselectHistories);
    };
  }, []);

  if (isLoading) return <AudioListLoadingUI />;

  return (
    <>
      {selectedHistories && (
        <Pressable
          onPress={handleMultipleHistoryRemove}
          style={styles.removeBtn}>
          <Text style={styles.removeBtnText}>Remove</Text>
        </Pressable>
      )}
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={handleOnRefresh}
            tintColor={colors.CONTRAST}
          />
        }
        style={styles.container}>
        {noData && <EmptyRecords title="There is no history!" />}
        {data &&
          data.map((item, mainIndex) => (
            <View key={item.date + mainIndex}>
              <Text style={styles.date}>{item.date}</Text>
              <View style={styles.listContainer}>
                {item.audios.map((audio, index) => (
                  <Pressable
                    onLongPress={() => handleOnLongPress(audio)}
                    onPress={() => handleOnPress(audio)}
                    key={audio.date + index}
                    style={[
                      styles.history,
                      {
                        backgroundColor: selectedHistories.includes(audio.id)
                          ? colors.INACTIVE_CONTRAST
                          : colors.OVERLAY,
                      },
                    ]}>
                    <Text style={styles.historyTitle}>{audio.title}</Text>

                    <Pressable onPress={() => handleSingleHistoryRemove(audio)}>
                      <AntDesign name="close" />
                    </Pressable>
                  </Pressable>
                ))}
              </View>
            </View>
          ))}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {},
  listContainer: {
    marginTop: 10,
    paddingLeft: 10,
  },
  date: {
    color: colors.SECONDARY,
  },
  historyTitle: {
    color: colors.CONTRAST,
    paddingHorizontal: 5,
    fontWeight: '700',
    flex: 1,
  },
  history: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    borderBottomWidth: 2,
    borderBottomColor: '#111',
    padding: 10,
    backgroundColor: colors.OVERLAY,
    marginBottom: 10,
  },
  removeBtn: {
    padding: 10,
    alignSelf: 'flex-end',
  },
  removeBtnText: {
    color: colors.CONTRAST,
  },
});

export default HistoryTab;
