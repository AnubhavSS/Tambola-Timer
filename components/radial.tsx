import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

export default function RadialBackground() {
  return (
    <View style={styles.container}>
      <Svg width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        <Defs>
          <RadialGradient id="grad" cx="50%" cy="50%" r="120%">
            <Stop offset="0%" stopColor="rgba(42, 162, 209, 1)" />
            <Stop offset="66%" stopColor="rgba(157, 157, 224, 1)" />
            <Stop offset="100%" stopColor="rgb(53, 83, 191)" />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#grad)" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
