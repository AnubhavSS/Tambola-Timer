import { useTimerStore } from "@/store";
import React from "react";
import { Dimensions, FlatList, StyleSheet, Text, View } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  const insets = useSafeAreaInsets();
  


  // Create an array of numbers from 1 to 90 for the Tambola board
  let gridData = Array.from({ length: 90 }, (_, i) => i + 1);


    const  availableWidth=(Dimensions.get("window").width*0.65)-insets.left-insets.right

  

  return (
    <View style={{ flex: 1 }}>
      {/* Tambola number grid */}
      <View style={[styles.grid,{width:availableWidth}]}>
      <FlatList
        data={gridData}
        keyExtractor={(item, index) => index.toString()}
        numColumns={gridLayout.numColumns}
         showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => {
          // Set background color based on whether the number has been called
          let bgColor = "rgba(255, 255, 255, 0.7)"; // default color for uncalled numbers
          let color = "black";
          if (history.includes(item)) {bgColor = "#20BD61"; color="white"} // highlight color for called numbers
          if (item === previousNumber) {bgColor = "red"; color="white"} // highlight color for previous number
          return (
            <View style={[styles.cell, { backgroundColor: bgColor,width:gridLayout.cellSize,height:gridLayout.cellSize, }]}>
              <Text style={[styles.cellText, { color: color }]}>{item}</Text>
            </View>
          );
        }}
      />
      </View>
    </View>
  );
};

export default Grid;

/**
 * Component Styles
 */
const styles = StyleSheet.create({
  grid: {
    alignItems: "center",
    backgroundColor: "rgba(238, 238, 238, 0.6)",
    borderRadius: 40,
    padding: hp("4%"),
    marginTop: hp("5%"),

  },
  cell: {
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
