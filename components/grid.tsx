import { useTimerStore } from "@/store";
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * Grid Component
 *
 * Displays a 6-column grid of numbers 1-90 for Tambola/Housie game.
 * Numbers that have been called are highlighted with a different background color.
 */
const Grid = () => {
  // Get the history of called numbers from the global store
  const history = useTimerStore((state) => state.history);
  const previousNumber = useTimerStore((state) => state.previousNumber);
  const gridLayout = useTimerStore((state) => state.gridLayout);



  // Create an array of numbers from 1 to 90 for the Tambola board
  let gridData = Array.from({ length: 90 }, (_, i) => i + 1);

  return (
    <SafeAreaView style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
  <View style={[styles.grid]}>
    <FlatList
      data={gridData}
      keyExtractor={(item, index) => index.toString()}
      numColumns={gridLayout.numColumns}
      scrollEnabled={false} // prevent scrolling
      renderItem={({ item }) => {
        let bgColor = "rgba(255, 255, 255, 0.7)";
        let color = "black";
        if (history.includes(item)) { bgColor = "#20BD61"; color = "white"; }
        if (item === previousNumber) { bgColor = "red"; color = "white"; }

        return (
          <View
            style={[
              styles.cell,
              {
                width: gridLayout.cellSize,
                height: gridLayout.cellSize,
                backgroundColor: bgColor,
              },
            ]}
          >
            <Text style={[styles.cellText, { color }]}>{item}</Text>
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
  backgroundColor: "rgba(238, 238, 238, 0.6)",
  borderRadius: 30,
  padding: 10,
  overflow: "hidden",
},
cell: {
  margin: 3,
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 8,
},
cellText: {
  fontSize: 18,
  fontWeight: "400",
},

});
