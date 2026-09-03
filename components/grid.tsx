import React, { useMemo, useState } from "react";
import {
  LayoutChangeEvent,
  Platform,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTimerStore } from "../store";
import { Theme } from "../theme";

const COLS = 10;
const ROWS = 9;
const GRID_DATA = Array.from({ length: 90 }, (_, i) => i + 1);

type BoardLayout = {
  cellSize: number;
  gap: number;
  pad: number;
  fontSize: number;
};

function boardFromBox(width: number, height: number): BoardLayout {
  const border = 2;
  const pad = Math.max(6, Math.round(Math.min(width, height) * 0.025));
  const gap = Math.max(2, Math.round(Math.min(width, height) * 0.01));
  const innerW = Math.max(0, width - border * 2 - pad * 2);
  const innerH = Math.max(0, height - border * 2 - pad * 2);
  const cellSize = Math.max(
    12,
    Math.floor(
      Math.min(
        (innerW - gap * (COLS - 1)) / COLS,
        (innerH - gap * (ROWS - 1)) / ROWS,
      ),
    ),
  );

  return {
    cellSize,
    gap,
    pad,
    fontSize: Math.max(10, Math.floor(cellSize * 0.49)),
  };
}

/** Matches gamescreen padding + left column so the board can paint on frame 1. */
function estimateHostSize(
  windowWidth: number,
  windowHeight: number,
  insets: { top: number; bottom: number; left: number; right: number },
) {
  const isWide = windowWidth > 1000;
  const padTop = Math.max(insets.top, hp(isWide ? 5 : 1.2));
  const padBottom = Math.max(insets.bottom, hp(isWide ? 5 : 1.2));
  const padLeft = insets.left + wp(2);
  const padRight = insets.right + wp(2);
  const leftCol = windowWidth * 0.29;
  const rowGap = wp(1.5);
  return {
    width: Math.max(80, windowWidth - padLeft - padRight - leftCol - rowGap),
    height: Math.max(80, windowHeight - padTop - padBottom),
  };
}

const Cell = React.memo(function Cell({
  item,
  size,
  fontSize,
  radius,
  bg,
  fg,
  border,
}: {
  item: number;
  size: number;
  fontSize: number;
  radius: number;
  bg: string;
  fg: string;
  border: string;
}) {
  return (
    <View
      style={[
        styles.cell,
        {
          width: size,
          height: size,
          backgroundColor: bg,
          borderColor: border,
          borderWidth: border === "transparent" ? 0 : 1,
          borderRadius: radius,
        },
      ]}
    >
      <Text
        numberOfLines={1}
        style={[
          styles.cellText,
          {
            color: fg,
            fontSize,
            lineHeight: fontSize + 2,
          },
        ]}
      >
        {item}
      </Text>
    </View>
  );
});

/**
 * Grid Component
 *
 * Displays the 1-90 Tambola board. Sized from the window on the first paint
 * (refined by onLayout only if the box differs) so it appears with the rest
 * of the game screen. Cell state: current > previous > called > idle.
 */
const Grid = ({ theme }: { theme: Theme }) => {
  const history = useTimerStore((state) => state.history);
  const currentNumber = useTimerStore((state) => state.currentNumber);
  const previousNumber = useTimerStore((state) => state.previousNumber);
  const insets = useSafeAreaInsets();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const estimated = useMemo(
    () => estimateHostSize(windowWidth, windowHeight, insets),
    [windowWidth, windowHeight, insets],
  );

  const [area, setArea] = useState(estimated);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    if (width < 8 || height < 8) return;
    if (Math.abs(width - area.width) < 2 && Math.abs(height - area.height) < 2) {
      return;
    }
    setArea({ width, height });
  };

  const layout = useMemo(
    () => boardFromBox(area.width, area.height),
    [area.width, area.height],
  );

  const called = useMemo(() => new Set(history), [history]);
  const cellRadius = Math.min(
    theme.radius.cell,
    Math.round(layout.cellSize * 0.22),
  );

  const boardWidth = COLS * layout.cellSize + (COLS - 1) * layout.gap;
  const boardHeight = ROWS * layout.cellSize + (ROWS - 1) * layout.gap;

  return (
    <View style={styles.host} onLayout={handleLayout} collapsable={false}>
      <View
        style={[
          styles.grid,
          {
            backgroundColor: theme.surface,
            borderColor: theme.surfaceBorder,
            borderRadius: theme.radius.card,
            padding: layout.pad,
            width: boardWidth + layout.pad * 2,
            height: boardHeight + layout.pad * 2,
          },
        ]}
      >
        <View
          style={{
            width: boardWidth,
            height: boardHeight,
            flexDirection: "row",
            flexWrap: "wrap",
            gap: layout.gap,
          }}
        >
          {GRID_DATA.map((item) => {
            let bg = theme.cell.idleBg;
            let fg = theme.cell.idleFg;
            let border = theme.cell.idleBorder ?? "transparent";

            if (called.has(item)) {
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
              <Cell
                key={item}
                item={item}
                size={layout.cellSize}
                fontSize={layout.fontSize}
                radius={cellRadius}
                bg={bg}
                fg={fg}
                border={border}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
};

export default React.memo(Grid);

const styles = StyleSheet.create({
  host: {
    flex: 1,
    minWidth: 0,
    minHeight: 0,
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
  },
  grid: {
    borderWidth: 1,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  cell: {
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  cellText: {
    fontWeight: "600",
    textAlign: "center",
    ...Platform.select({
      android: { includeFontPadding: false, textAlignVertical: "center" },
      default: {},
    }),
  },
});
