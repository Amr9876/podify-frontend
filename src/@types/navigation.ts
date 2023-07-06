import {AudioData} from './audio';

interface NewUserResponse {
  id: string;
  name: string;
  email: string;
}

export type AuthStackParamList = {
  SignUp: undefined;
  SignIn: undefined;
  LostPassword: undefined;
  Verification: {userInfo: NewUserResponse};
};

export type ProfileNavigatorStackParamList = {
  Profile: undefined;
  ProfileSettings: undefined;
  Verification: {userInfo: NewUserResponse};
  UpdateAudio: {audio: AudioData};
};

export type HomeNavigatorStackParamList = {
  Home: undefined;
  PublicProfile: {profileId: string};
  Profile: undefined;
};

export type PublicProfileTabParamList = {
  PublicUploads: {profileId: string};
  PublicPlaylist: {profileId: string};
};
