import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { ThemeId } from "./theme";

/**
 * TimerState Interface
 *
 * Defines the structure of the global state for the Tambola Timer application.
 * Contains all the state variables and functions needed for the timer functionality.
 */
interface TimerState {
  progress: number; // Current progress of the timer (0-1)
  play_pause: boolean; // Play/pause state of the timer
  togglePlayPause: () => void; // Function to toggle play/pause state
  currentNumber: number; // Current number being displayed
  history: number[]; // History of all numbers that have been called
  setNumber: (num: number) => void; // Function to set a new number
  previousNumber: number | null; // Previous number that was called
  setProgress: (p: number) => void; // Function to update progress
  soundVolume: number; // Volume for speech synthesis (0-1)
  timerInterval: number; // Time interval between numbers in seconds
  language: string; // Language for speech synthesis
  rate: number; // Speech rate for number announcements
  games: string[]; // List of available games
  setGames: (games: string[]) => void; // Function to update games list
  previousArray: number[]; // Array of previous numbers that were called
  showPreviousModal: boolean; // State to show/hide previous modal
  setShowPreviousModal: () => void; // Function to set showPreviousModal state
  resetStore: () => void;
  gridLayout: {
    numColumns: number;
    cellSize: number;
    cellMargin: number;
  };

  themeId: ThemeId; // Currently selected UI theme (persisted)
  setTheme: (id: ThemeId) => void; // Function to change the UI theme
  seenHowTo: boolean; // Whether the How-to-play modal has been shown once (persisted)
  setSeenHowTo: () => void; // Marks the How-to-play modal as seen
}

/**
 * Timer Store
 *
 * Global state management for the Tambola Timer app using Zustand.
 * Manages timer state, number generation, history, and settings.
 */
export const useTimerStore = create<TimerState>()(
  persist(
    (set) => ({
      // Initial state values
      progress: 0,
      play_pause: true,
      togglePlayPause: () =>
        set((state) => ({ play_pause: !state.play_pause })),
      currentNumber: 0,
      previousNumber: null,
      history: [],

      // Set a new number and update related state
      setNumber: (num) =>
        set((state) => ({
          currentNumber: num,
          history: [...state.history, num],
          previousNumber: state.currentNumber, // shift current → previous
          progress: 0, // reset progress when new number is drawn
        })),

      // Update timer progress
      setProgress: (p) => set({ progress: p }),

      // Default settings
      soundVolume: 0.5,
      timerInterval: 10,
      language: "en-US",
      rate: 0.5,
      games: [],

      // Update games list
      setGames: (games) => set({ games }),
      previousArray: [], // Array of previous numbers that were called
      showPreviousModal: false, // State to show/hide previous modal
      setShowPreviousModal: () =>
        set((state) => ({ showPreviousModal: !state.showPreviousModal })), // Function to set showPreviousModal state
      resetStore: () =>
        set({
          progress: 0,
          play_pause: true,
          currentNumber: 0,
          previousNumber: null,
          history: [],
          previousArray: [],
          showPreviousModal: false,
        }),
      gridLayout: {
        numColumns: 10,
        cellSize: 0,
        cellMargin: 3,
      },

      // UI theme
      themeId: "midnight",
      setTheme: (id) => set({ themeId: id }),
      seenHowTo: false,
      setSeenHowTo: () => set({ seenHowTo: true }),
    }),
    {
      name: "tambola-settings",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        themeId: state.themeId,
        seenHowTo: state.seenHowTo,
        games: state.games,
      }),
    },
  ),
);
