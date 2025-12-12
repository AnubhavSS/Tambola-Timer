/**
 * DataItem Interface
 * 
 * Defines the structure for dropdown items used in the app.
 * Each item has a label for display and a value for internal use.
 */
export interface DataItem {
    label: string;
    value: string;
}

/**
 * Tambola Game Types
 * 
 * List of different game types available in Tambola/Housie.
 * Used for game selection in the settings screen.
 * 
 * Includes common patterns like:
 * - Early number patterns (5, 7, 9)
 * - Line patterns (Top, Middle, Bottom)
 * - Full House and special patterns
 */
export const data: DataItem[] = [
    { label: 'Early 5', value: 'Early 5' },
    { label: 'Early 7', value: 'Early 7' },
    { label: 'Early 9', value: 'Early 9' },
    { label: 'Corners', value: 'Corners' },
    { label: 'Top Line', value: 'Top Line' },
    { label: 'Middle Line', value: 'Middle Line' },
    { label: 'Bottom Line', value: 'Bottom Line' },
    { label: 'Full House', value: 'Full House' },
    { label: 'Lunch', value: 'Lunch' },
    { label: 'Breakfast', value: 'Breakfast' },
    { label: 'Dinner', value: 'Dinner' },
    { label: 'Day', value: 'Day' },
    { label: 'Night', value: 'Night' },
    { label: 'H', value: 'H' },
    { label: 'Second House', value: 'Second House' },
    { label: 'Third House', value: 'Third House' },
    { label: 'BP High', value: 'BP High' },
    { label: 'BP Low', value: 'BP Low' },
  ];


export const How_To_Play: string[] = [
  "Tap \u201cStart New Game\u201d to begin the timer.",
  "Numbers will be called automatically at your chosen interval.",
  "You can adjust the Call Interval, Rate, Volume, Language in \u201cSettings.\u201d",
  "You can also add game names in \u201cSettings.\u201d",
  "Pause the timer at any time by tapping the Number.",
  "You can view the called numbers in the history.",
  "Previous number is displayed in \u201cRed color.\u201d"
];
