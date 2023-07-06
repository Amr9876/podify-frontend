import {Pressable} from 'react-native';
import {PropsWithChildren} from 'react';
import colors from '@utils/colors';

interface Props extends PropsWithChildren {
  size?: number;
  ignoreContainer?: boolean;
  onPress?: () => void;
}

const PlayerController = ({
  size = 45,
  ignoreContainer = true,
  onPress,
  children,
}: Props) => {
  return (
    <Pressable
      onPress={onPress}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: ignoreContainer ? 'transparent' : colors.CONTRAST,
      }}>
      {children}
    </Pressable>
  );
};

export default PlayerController;
