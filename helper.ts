import { Dimensions } from "react-native";
import { useTimerStore } from "./store";

/**
 * Shuffle Array
 *
 * Randomizes the order of elements in an array using the Fisher-Yates algorithm.
 * Used to randomize the order of Tambola numbers.
 *
 * @param array - The array to shuffle
 * @returns The shuffled array
 */
function shuffle(array: number[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Initialize array of numbers 1-90 for Tambola
let numbers = Array.from({ length: 90 }, (_, i) => i + 1);

/**
 * Start Tambola Number Generator
 *
 * Initiates the timer and number generation process for the Tambola game.
 * - Shuffles the numbers array to ensure random order
 * - Sets up a timer to draw numbers at specified intervals
 * - Updates progress bar between number draws
 * - Stops when all numbers have been drawn
 *
 * @param intervalSec - Time interval between numbers in seconds
 * @returns Cleanup function to stop the timer
 */
export function startTambolaGenerator(intervalSec: number) {
  // Shuffle the numbers array for randomization
  numbers = shuffle(numbers);

  /**
   * Draw Next Number
   *
   * Draws the next number from the shuffled array and updates the store.
   * Stops the game when all numbers have been drawn.
   */
  function drawNext() {
    if (numbers.length === 0) {
      console.log("All numbers drawn!");
      useTimerStore.setState({ play_pause: false });
      return;
    }

    const next = numbers.pop();
    // console.log(next);
    useTimerStore.getState().setNumber(next as number); // ✅ use getState() for outside React
    useTimerStore.setState({
      previousArray: [
        next as number,
        ...useTimerStore.getState().previousArray,
      ],
    });
  }

  // Progress loop: update every 100ms
  const stepTime = 100; // ms
  let elapsed = 0;
  const progressTimer = setInterval(() => {
    elapsed += stepTime;
    const progress = Math.min(elapsed / (intervalSec * 1000), 1);
    useTimerStore.getState().setProgress(progress);

    if (progress >= 1) {
      elapsed = 0; // reset
      drawNext();
    }
  }, stepTime);

  // Return cleanup function to stop the timer
  return () => clearInterval(progressTimer);
}

export function calculateGridLayout({
  top,
  bottom,
}: {
  top: number;
  bottom: number;
}) {
 const { width, height } = Dimensions.get("window");
  const totalNumbers = 90;
  const cellMargin = 2; // tight margin
  const availableWidth = width - cellMargin * 2;
  const availableHeight = height - top - bottom - cellMargin * 2;


   // 🔹 Decide number of columns based on landscape height
  // Because in landscape, height determines how “tall” the grid can be
  let cols;
  if (height <= 500) {
    cols = 11; // very short screens — small phones in landscape
  } else if (height > 500 && height <= 700) {
    cols = 10; // most phones in landscape (e.g. Pixel 9 Pro)
  } else {
    cols = 9; // large tablets — more space vertically
  }

  // Compute rows
  const rows = Math.ceil(totalNumbers / cols);

  // Compute exact cell size to fill available space perfectly
  const totalHorizontalMargins = cellMargin * 2 * cols;
  const totalVerticalMargins = cellMargin * 2 * rows;
  const cellWidth = (availableWidth - totalHorizontalMargins*2) / cols;
  const cellHeight = (availableHeight - totalVerticalMargins*3) / rows;
  let finalCellSize = Math.min(cellWidth, cellHeight);
  finalCellSize=cols === 9 ? finalCellSize*0.9 : finalCellSize*1.1;


  useTimerStore.setState({
    gridLayout: { cellSize: finalCellSize, numColumns: cols, cellMargin, },
  });

}
