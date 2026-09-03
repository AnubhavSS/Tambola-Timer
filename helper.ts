import { Dimensions } from "react-native";
import {
  AdEventType,
  InterstitialAd,
  TestIds,
} from "react-native-google-mobile-ads";
import { useTimerStore } from "./store";

const adUnitId = __DEV__
  ? TestIds.INTERSTITIAL
  : "ca-app-pub-2097672905689831/9745926177";

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
  const cols = 10;
  const rows = 9;
  const cellMargin = 3;
  // Game screen is a row: timer column (~32%) + remaining width for the board.
  const availableWidth = width * 0.62;
  const availableHeight = height - top - bottom;
  const cellWidth = (availableWidth - cellMargin * (cols - 1)) / cols;
  const cellHeight = (availableHeight - cellMargin * (rows - 1)) / rows;
  const finalCellSize = Math.max(12, Math.floor(Math.min(cellWidth, cellHeight)));

  useTimerStore.setState({
    gridLayout: { cellSize: finalCellSize, numColumns: cols, cellMargin },
  });
}

let interstitial: InterstitialAd | null = null;
let isAdLoaded = false;

function createAndLoadInterstitial() {
  interstitial = InterstitialAd.createForAdRequest(adUnitId, {
    keywords: ["fashion", "clothing"],
  });

  interstitial.addAdEventListener(AdEventType.LOADED, () => {
    isAdLoaded = true;
  });

  interstitial.addAdEventListener(AdEventType.CLOSED, () => {
    isAdLoaded = false;
    createAndLoadInterstitial(); // preload next ad
  });

  interstitial.load();
}

// Call once (app start / screen mount)
createAndLoadInterstitial();

export function showInterstitialAd() {
  if (isAdLoaded && interstitial) {
    interstitial.show();
  } else {
    console.log("Ad not loaded yet");
  }
}
