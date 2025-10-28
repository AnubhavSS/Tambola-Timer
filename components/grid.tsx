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
  
  // const [numColumns, setNumColumns] = useState(6);
  // const [numRows, setNumRows] = useState(15);
  // const [cellSize, setCellSize] = useState(40);

  // Create an array of numbers from 1 to 90 for the Tambola board
  let gridData = Array.from({ length: 90 }, (_, i) => i + 1);

//   const { width, height } = Dimensions.get("window");
//     const insets = useSafeAreaInsets();

//     const  availableHeight=width
    const  availableWidth=(Dimensions.get("window").width*0.65)-insets.left-insets.right
// const totalNumber=90
// const cellMargin=3

//   useEffect(() => { 
//     // initial guess for cell size (tuned for phones)
//     const targetCellSize = Math.max(40, Math.min(availableWidth / 15, availableHeight / 10));

//     // compute possible number of columns that can fit horizontally
//     let cols = Math.floor(availableWidth / (targetCellSize + cellMargin * 2));
//     if (cols < 6) cols = 12; // minimum columns
//     if (cols > 15) cols = 10; // maximum columns (for tablets)

//     // rows needed for 90 numbers
//     let rows = Math.ceil(totalNumber / cols);

//     // recompute final cell size to fill height neatly
//     const cellW = Math.floor((availableWidth - cols * cellMargin * 2) / cols);
//     const cellH = Math.floor((availableHeight - rows * cellMargin * 2) / rows);
//     const finalCellSize = Math.min(cellW, cellH);

//     setNumColumns(cols);
//     setNumRows(rows);
//     setCellSize(finalCellSize);

//     // return { numColumns: cols, numRows: rows, cellSize: finalCellSize };
// }, []);

  // const gridWidth = numColumns * (cellSize + cellMargin * 2);
  // const gridHeight = numRows * (cellSize + cellMargin * 2);
  

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
    width: wp("65"), // Responsive width based on screen percentage
    height: hp("93%"), // Responsive height based on screen percentage
      alignItems: "center",
    backgroundColor: "rgba(238, 238, 238, 0.6)",
    borderRadius: 40,
    padding: hp("3%"),
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
