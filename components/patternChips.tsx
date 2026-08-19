import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { useTimerStore } from "../store";
import { Theme } from "../theme";

const QUICK_PATTERNS = [
  "Early 5",
  "Top Line",
  "Middle Line",
  "Bottom Line",
  "Corners",
  "Full House",
];

/**
 * PatternChips
 *
 * Quick-toggle strip for the 6 most common patterns during play. Reads and
 * writes the same `games` store array used by the Settings screen's
 * "Patterns in play" picker, replacing the old modal+checkbox flow in
 * components/games.tsx.
 */
export default function PatternChips({ theme }: { theme: Theme }) {
  const games = useTimerStore((state) => state.games);
  const setGames = useTimerStore((state) => state.setGames);

  const toggle = (pattern: string) => {
    if (games.includes(pattern)) {
      setGames(games.filter((g) => g !== pattern));
    } else {
      setGames([...games, pattern]);
    }
  };

  return (
    <View style={styles.row}>
      {QUICK_PATTERNS.map((pattern) => {
        const active = games.includes(pattern);
        return (
          <Pressable
            key={pattern}
            onPress={() => toggle(pattern)}
            style={[
              styles.chip,
              {
                backgroundColor: active ? theme.accent : theme.surface,
                borderColor: active ? theme.accent : theme.surfaceBorder,
              },
            ]}
          >
            <Text
              style={[
                styles.chipText,
                { color: active ? theme.accentOn : theme.text, fontFamily: theme.font.body },
              ]}
            >
              {pattern}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: hp(1.1),
    columnGap: wp(1.2),
  },
  chip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: hp(1.1),
    paddingHorizontal: wp(2.2),
  },
  chipText: {
    fontSize: hp(1.55),
    fontWeight: "600",
  },
});
