import BasicModalContainer from '@ui/BasicModalContainer';
import colors from '@utils/colors';
import {useState} from 'react';
import {Pressable, TextInput} from 'react-native';
import {StyleSheet, Text, View} from 'react-native';
import MaterialComIcon from 'react-native-vector-icons/MaterialCommunityIcons';

export interface PlaylistInfo {
  title: string;
  private: boolean;
}

interface Props {
  visible: boolean;
  onRequestClose: () => void;
  onSubmit: (value: PlaylistInfo) => void;
}

const PlaylistForm = ({visible, onRequestClose, onSubmit}: Props) => {
  const [playlistInfo, setPlaylistInfo] = useState({
    title: '',
    private: false,
  });

  const handleSubmit = () => {
    onSubmit(playlistInfo);
    handleClose();
  };

  const handleClose = () => {
    setPlaylistInfo({title: '', private: false});

    onRequestClose();
  };

  return (
    <BasicModalContainer visible={visible} onRequestClose={handleClose}>
      <View>
        <Text style={{fontSize: 18, color: colors.PRIMARY, fontWeight: '700'}}>
          Create New Playlist
        </Text>
        <TextInput
          onChangeText={text => setPlaylistInfo({...playlistInfo, title: text})}
          placeholder="title"
          style={{
            height: 45,
            paddingVertical: 10,
            borderBottomWidth: 2,
            borderBottomColor: colors.PRIMARY,
            color: colors.PRIMARY,
          }}
          value={playlistInfo.title}
        />
        <Pressable
          onPress={() =>
            setPlaylistInfo({...playlistInfo, private: !playlistInfo.private})
          }
          style={{height: 45, alignItems: 'center', flexDirection: 'row'}}>
          {playlistInfo.private ? (
            <MaterialComIcon name="radiobox-marked" color={colors.PRIMARY} />
          ) : (
            <MaterialComIcon name="radiobox-blank" color={colors.PRIMARY} />
          )}
          <Text style={{color: colors.PRIMARY, marginLeft: 5}}>Private</Text>
        </Pressable>

        <Pressable
          style={{
            height: 45,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 0.5,
            borderColor: colors.PRIMARY,
            borderRadius: 7,
          }}
          onPress={handleSubmit}>
          <Text>Create</Text>
        </Pressable>
      </View>
    </BasicModalContainer>
  );
};

export default PlaylistForm;

const styles = StyleSheet.create({});
