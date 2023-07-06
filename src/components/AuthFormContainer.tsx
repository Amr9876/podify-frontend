import {Image, StyleSheet, Text, SafeAreaView, View} from 'react-native';
import {PropsWithChildren} from 'react';
import AppCircle from '@ui/AppCircle';
import colors from '@utils/colors';

interface Props extends PropsWithChildren {
  heading: string;
  subHeading: string;
}

const AuthFormContainer = ({heading, subHeading, children}: Partial<Props>) => {
  return (
    <SafeAreaView style={styles.container}>
      <AppCircle size={200} position="top-left" />
      <AppCircle size={150} position="top-right" />
      <AppCircle size={200} position="bottom-right" />
      <AppCircle size={150} position="bottom-left" />

      <View style={styles.headerContainer}>
        <Image source={require('../assets/logo.png')} />
        <Text style={styles.heading}>{heading}</Text>
        <Text style={styles.subHeading}>{subHeading}</Text>
      </View>

      {children}
    </SafeAreaView>
  );
};

export default AuthFormContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  heading: {
    color: colors.SECONDARY,
    fontSize: 25,
    fontWeight: 'bold',
    paddingVertical: 5,
  },
  subHeading: {color: colors.CONTRAST, fontSize: 16},
  headerContainer: {width: '100%', paddingLeft: 19, paddingVertical: 19},
});
