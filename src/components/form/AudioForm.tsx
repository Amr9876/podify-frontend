import CategorySelector from '@components/CategorySelector';
import FileSelector from '@components/FileSelector';
import AppButton from '@ui/AppButton';
import colors from '@utils/colors';
import {
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  Text,
  Pressable,
} from 'react-native';
import MaterialComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useEffect, useState} from 'react';
import {categories} from '@utils/categories';
import {types, DocumentPickerResponse} from 'react-native-document-picker';
import * as yup from 'yup';
import {getClient} from 'src/api/client';
import Progress from '@ui/Progress';
import {mapRange} from '@utils/math';
import {useDispatch} from 'react-redux';
import {catchAsyncError} from 'src/api/catchError';
import {updateNotification} from 'src/store/notificationSlice';
import AppView from '@components/AppView';
import {useQueryClient} from 'react-query';

interface FormFields {
  title: string;
  about: string;
  category: string;
  file?: DocumentPickerResponse;
  poster?: DocumentPickerResponse;
}

const defaultForm: FormFields = {
  title: '',
  about: '',
  category: '',
};

const commonSchema = {
  title: yup.string().trim().required('Title is missing!'),
  category: yup.string().oneOf(categories, 'Category is missing!'),
  about: yup.string().trim().required('About is missing!'),
  poster: yup.object().shape({
    uri: yup.string().required('Audio file is missing!'),
    name: yup.string().required('Audio file is missing!'),
    type: yup.string().required('Audio file is missing!'),
    size: yup.number().required('Audio file is missing!'),
  }),
};

const newAudioSchema = yup.object().shape({
  ...commonSchema,
  file: yup.object().shape({
    uri: yup.string().required('Audio file is missing!'),
    name: yup.string().required('Audio file is missing!'),
    type: yup.string().required('Audio file is missing!'),
    size: yup.number().required('Audio file is missing!'),
  }),
});

const oldAudioSchema = yup.object().shape({
  ...commonSchema,
});

interface Props {
  initialValues?: {
    title: string;
    about: string;
    category: string;
  };
  onSubmit: (formData: FormData) => void;
  progress?: number;
  busy?: boolean;
}

const AudioForm = ({initialValues, progress = 0, busy, onSubmit}: Props) => {
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [audioInfo, setAudioInfo] = useState({...defaultForm});
  const [isForUpdate, setIsForUpdate] = useState(false);

  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const handleSubmit = async () => {
    try {
      let data;
      const formData = new FormData();

      if (isForUpdate) {
        data = await oldAudioSchema.validate(audioInfo);
      } else {
        data = await newAudioSchema.validate(audioInfo);
        formData.append('file', {
          name: data.file.name,
          type: data.file.type,
          uri: data.file.uri,
        });
      }

      formData.append('title', data.title);
      formData.append('about', data.about);
      formData.append('category', data.category);

      if (data.poster.uri)
        formData.append('poster', {
          name: data.poster.name,
          type: data.poster.type,
          uri: data.poster.uri,
        });

      onSubmit(formData);

      await queryClient.invalidateQueries({queryKey: ['latest-uploads']});
      await queryClient.invalidateQueries({queryKey: ['recently-played']});
      await queryClient.invalidateQueries({queryKey: ['recommended']});
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      dispatch(updateNotification({message: errorMessage, type: 'error'}));
    }
  };

  useEffect(() => {
    if (initialValues) {
      setAudioInfo({
        ...initialValues,
      });
      setIsForUpdate(true);
    }
  }, [initialValues]);

  return (
    <AppView>
      <ScrollView style={styles.container}>
        <View style={styles.fileSelectorContainer}>
          <FileSelector
            icon={
              <MaterialComIcon
                name="image-outline"
                size={35}
                color={colors.SECONDARY}
              />
            }
            btnTitle="Select Poster"
            options={{type: [types.images]}}
            onSelect={poster => setAudioInfo({...audioInfo, poster})}
          />

          {!isForUpdate && (
            <FileSelector
              icon={
                <MaterialComIcon
                  name="file-music-outline"
                  size={35}
                  color={colors.SECONDARY}
                />
              }
              btnTitle="Select Audio"
              options={{type: [types.audio]}}
              onSelect={file => setAudioInfo({...audioInfo, file})}
              style={{marginLeft: 20}}
            />
          )}
        </View>

        <View style={styles.formContainer}>
          <TextInput
            placeholderTextColor={colors.INACTIVE_CONTRAST}
            placeholder="Title"
            style={styles.input}
            onChangeText={title => setAudioInfo({...audioInfo, title})}
            value={audioInfo.title}
          />

          <Pressable
            onPress={() => setShowCategoryModal(true)}
            style={styles.categorySelector}>
            <Text style={styles.categorySelectorTitle}>Category</Text>
            <Text style={styles.selectedCategory}>{audioInfo.category}</Text>
          </Pressable>

          <TextInput
            placeholderTextColor={colors.INACTIVE_CONTRAST}
            placeholder="About"
            style={styles.input}
            onChangeText={about => setAudioInfo({...audioInfo, about})}
            value={audioInfo.about}
            numberOfLines={10}
            multiline
          />

          <CategorySelector
            visible={showCategoryModal}
            onRequestClose={() => setShowCategoryModal(false)}
            onSelect={item => setAudioInfo({...audioInfo, category: item})}
            title="Category"
            data={categories}
            renderItem={item => <Text style={styles.category}>{item}</Text>}
          />

          <View style={{marginVertical: 20}}>
            {busy && <Progress progress={progress} />}
          </View>

          <AppButton
            isBusy={busy}
            title={isForUpdate ? 'Save' : 'Submit'}
            onPress={handleSubmit}
          />
        </View>
      </ScrollView>
    </AppView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  fileSelectorContainer: {
    flexDirection: 'row',
  },
  formContainer: {
    marginTop: 20,
  },
  input: {
    borderWidth: 2,
    borderColor: colors.SECONDARY,
    borderRadius: 7,
    padding: 10,
    fontSize: 18,
    color: colors.CONTRAST,
    textAlignVertical: 'top',
  },
  category: {
    padding: 10,
    color: colors.PRIMARY,
  },
  categorySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  categorySelectorTitle: {
    color: colors.CONTRAST,
  },
  selectedCategory: {
    color: colors.SECONDARY,
    marginLeft: 5,
    fontStyle: 'italic',
  },
});

export default AudioForm;
