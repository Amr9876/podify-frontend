import {PropsWithChildren} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import AppNotification from './AppNotification';

const AppContainer = ({children}: PropsWithChildren) => {
  return (
    <SafeAreaView style={styles.container}>
      <AppNotification />
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AppContainer;
