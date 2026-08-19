import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import { useTheme } from '../theme';

/**
 * ThemedBackground
 *
 * Renders the current theme's app background:
 * - midnight: a single centered radial gradient (dark navy -> near-black)
 * - festive: a warm paper base with two off-center radial washes
 * - stage: a flat near-black fill
 */
export default function ThemedBackground() {
  const theme = useTheme();

  if (theme.id === 'stage') {
    return <View style={[styles.container, { backgroundColor: theme.bg.stops[0] }]} />;
  }

  if (theme.id === 'festive') {
    const [base, warmWash, roseWash] = theme.bg.stops;
    return (
      <View style={styles.container}>
        <Svg width="100%" height="100%">
          <Defs>
            <RadialGradient id="warm" cx="12%" cy="18%" r="55%">
              <Stop offset="0%" stopColor={warmWash} />
              <Stop offset="100%" stopColor={warmWash} stopOpacity={0} />
            </RadialGradient>
            <RadialGradient id="rose" cx="88%" cy="84%" r="55%">
              <Stop offset="0%" stopColor={roseWash} />
              <Stop offset="100%" stopColor={roseWash} stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill={base} />
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#warm)" />
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#rose)" />
        </Svg>
      </View>
    );
  }

  // midnight
  const [near, mid, far] = theme.bg.stops;
  return (
    <View style={styles.container}>
      <Svg width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        <Defs>
          <RadialGradient id="grad" cx="20%" cy="0%" r="120%">
            <Stop offset="0%" stopColor={near} />
            <Stop offset="45%" stopColor={mid} />
            <Stop offset="100%" stopColor={far} />
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
