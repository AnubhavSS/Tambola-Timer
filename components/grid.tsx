import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTimerStore } from "../store";
import { Theme } from "../theme";

/**
 * Grid Component
 *
 * Displays the 1-90 Tambola board. Cell state precedence is
 * current > previous > called > idle.
 */
const Grid = ({ theme }: { theme: Theme }) => {
  const history = useTimerStore((state) => state.history);
  const currentNumber = useTimerStore((state) => state.currentNumber);
  const previousNumber = useTimerStore((state) => state.previousNumber);
  const gridLayout = useTimerStore((state) => state.gridLayout);

  // Create an array of numbers from 1 to 90 for the Tambola board
  let gridData = Array.from({ length: 90 }, (_, i) => i + 1);

  return (
    <SafeAreaView
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <View
        style={[
          styles.grid,
          {
            backgroundColor: theme.surface,
            borderColor: theme.surfaceBorder,
            borderRadius: theme.radius.card,
          },
        ]}
      >
        <FlatList
          data={gridData}
          keyExtractor={(item, index) => index.toString()}
          numColumns={gridLayout.numColumns}
          scrollEnabled={false} // prevent scrolling
          renderItem={({ item }) => {
            let bg = theme.cell.idleBg;
            let fg = theme.cell.idleFg;
            let border = theme.cell.idleBorder ?? "transparent";

            if (history.includes(item)) {
              bg = theme.cell.calledBg;
              fg = theme.cell.calledFg;
              border = theme.cell.calledBorder ?? border;
            }
            if (item === previousNumber) {
              bg = theme.cell.prevBg;
              fg = theme.cell.prevFg;
            }
            if (item === currentNumber) {
              bg = theme.cell.curBg;
              fg = theme.cell.curFg;
            }

            return (
              <View
                style={[
                  styles.cell,
                  {
                    width: gridLayout.cellSize,
                    height: gridLayout.cellSize,
                    backgroundColor: bg,
                    borderColor: border,
                    borderWidth: border === "transparent" ? 0 : 1,
                    borderRadius: theme.radius.cell,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.cellText,
                    { color: fg },
                    { fontSize: gridLayout.cellSize * 0.5 },
                  ]}
                >
                  {item}
                </Text>
              </View>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default Grid;

/**
 * Component Styles
 */
const styles = StyleSheet.create({
  grid: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    padding: wp(1),
    overflow: "hidden",
  },

  counter: {
    fontSize: hp(1.6),
    fontWeight: "600",
  },
  cell: {
    margin: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  cellText: {
    fontWeight: "600",
  },
});
