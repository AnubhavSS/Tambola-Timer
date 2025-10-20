import { useTimerStore } from "@/store";
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";

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

  // Create an array of numbers from 1 to 90 for the Tambola board
  let gridData = Array.from({ length: 90 }, (_, i) => i + 1);
  

  return (
    <View style={{ flex: 1 }}>
      {/* Tambola number grid */}
      <FlatList
        data={gridData}
        keyExtractor={(item, index) => index.toString()}
        numColumns={12}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => {
          // Set background color based on whether the number has been called
          let bgColor = "rgba(255, 255, 255, 0.7)"; // default color for uncalled numbers
          let color = "black";
          if (history.includes(item)) {bgColor = "#20BD61"; color="white"} // highlight color for called numbers
          if (item === previousNumber) {bgColor = "red"; color="white"} // highlight color for previous number
          return (
            <View style={[styles.cell, { backgroundColor: bgColor }]}>
              <Text style={[styles.cellText, { color: color }]}>{item}</Text>
            </View>
          );
        }}
      />
    </View>
  );
};

export default Grid;

/**
 * Component Styles
 */
const styles = StyleSheet.create({
  grid: {
    width: wp("65"), // Responsive width based on screen percentage
    height: hp("93%"), // Responsive height based on screen percentage
      alignItems: "center",
    backgroundColor: "rgba(238, 238, 238, 0.6)",
    borderRadius: 40,
    padding: hp("5%"),
    marginTop: hp("5%"),

  },
  cell: {
    height: hp("9.2"), // Responsive height based on screen percentage
    aspectRatio: 1, // Keep cells square
    margin: 3,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
   
  },
  cellText: {
    fontSize: wp("2%"), // Responsive font size
    fontWeight: "semibold",
  },
});
