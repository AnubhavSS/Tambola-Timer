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
      useTimerStore.setState({play_pause: false});
      return;
    }

    const next = numbers.pop();
    // console.log(next);
    useTimerStore.getState().setNumber(next as number); // ✅ use getState() for outside React
    useTimerStore.setState({previousArray: [next as number,...useTimerStore.getState().previousArray ]});
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


export function calculateGridLayout({top,bottom}:{top:number,bottom:number}) {

  const  availableHeight=Dimensions.get('window').height
  const  availableWidth=(Dimensions.get("window").width*0.65)-top-bottom
const totalNumber=90
const cellMargin=3

  // initial guess for cell size (tuned for phones)
  const targetCellSize = Math.max(40, Math.min(availableWidth / 15, availableHeight / 10));


    // compute possible number of columns that can fit horizontally
    let cols = Math.floor(availableWidth / (targetCellSize + cellMargin * 2));
    let newCols=cols
    if (cols < 6) cols = 15; // minimum columns
    else if (cols > 12) cols = 10; // maximum columns (for tablets)
    else cols=11


  const rows = Math.ceil(totalNumber / cols);

  const cellW = Math.floor((availableWidth - cols * cellMargin * 4) / newCols);
  const cellH = Math.floor((availableHeight - rows * cellMargin * 4) / rows);
  const finalCellSize = Math.min(cellW, cellH);

  useTimerStore.setState({gridLayout: {numColumns: cols, cellSize: finalCellSize}});


}

