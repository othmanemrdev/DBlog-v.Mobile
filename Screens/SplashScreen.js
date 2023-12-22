import React from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import ProgressBar from 'react-native-progress/Bar';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo.png')}
        style={styles.logo}
      />
      <ProgressBar indeterminate width={200} color="#2f2f2f" />
      <View style={styles.bottomContainer}>
        <Text style={styles.text}>Made by <Text style={styles.boldText}>Othmane</Text></Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f2f2f2',
  },
  logo: {
    width: 250,
    height: 250,
    marginBottom: 50,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 20,
  },
  text: {
    fontSize: 16,
  },
  boldText: {
    fontWeight: 'bold',
  },
});