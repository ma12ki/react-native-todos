import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Header from './Header';
import Footer from './Footer';

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Header />
        <View style={styles.content}>
          <Text>Open up App.js to start working on your app!</Text>
          <Text>Changes you make will automatically reload.</Text>
          <Text>Shake your phone to open the developer menu.</Text>
        </View>
        <Footer />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
});
