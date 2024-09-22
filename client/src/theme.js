// These color tokens are used in the theme to generate the colors
// for the MUI components. The keys are the color names, and the
// values are the hex color values.
export const colorTokens = {
  grey: {
    0: "#FFFFFF",
    10: "#F6F6F6",
    50: "#E0E0E0",
    100: "#C2C2C2",
    200: "#A3A3A3",
    300: "#858585",
    400: "#666666",
    500: "#4D4D4D",
    600: "#333333",
    700: "#1A1A1A",
    800: "#121212",
    850: "#0F0F0F",
    900: "#0D0D0D",
    950: "#0A0A0A",
    1000: "#000000",
  },
  primary: {
    50: "#E8F0FE",
    100: "#D0E1FD",
    200: "#A2C4FB",
    300: "#74A7F9",
    400: "#478AF8",
    450: "#3A7CE6",
    500: "#1A6EF7",
    600: "#1558C5",
    650: "#1148A3",
    700: "#104294",
    800: "#0B2C62",
    900: "#061631",
  },
  accent: {
    50: "#FFE5E5",
    100: "#FFD2D2",
    200: "#FFA3A3",
    300: "#FF7474",
    400: "#FF4545",
    450: "#FF2A2A",
    500: "#FF1616",
    600: "#CC1212",
    700: "#990D0D",
    800: "#660909",
    900: "#330404",
  },
  success: {
    50: "#E6F8E6",
    100: "#CCF1CC",
    200: "#99E399",
    300: "#66D466",
    400: "#33C633",
    500: "#00B800",
    600: "#009400",
    700: "#006F00",
    800: "#004B00",
    900: "#002600",
  },
  warning: {
    50: "#FFF5E6",
    100: "#FFEBCC",
    200: "#FFD699",
    300: "#FFC166",
    400: "#FFAC33",
    500: "#FF9600",
    600: "#CC7800",
    700: "#995A00",
    800: "#663C00",
    900: "#331E00",
  },
};

// Generate a theme based on the mode
export const themeSettings = (mode) => {
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            primary: {
              dark: colorTokens.primary[300],
              main: colorTokens.primary[500],
              light: colorTokens.primary[700],
            },
            neutral: {
              dark: colorTokens.grey[100],
              main: colorTokens.grey[200],
              mediumMain: colorTokens.grey[300],
              medium: colorTokens.grey[400],
              light: colorTokens.grey[600],
            },
            background: {
              default: colorTokens.grey[900],
              alt: colorTokens.grey[850],
            },
            success: {
              main: colorTokens.success[400],
              light: colorTokens.success[200],
              dark: colorTokens.success[600],
            },
            warning: {
              main: colorTokens.warning[500],
              light: colorTokens.warning[300],
              dark: colorTokens.warning[700],
            },
          }
        : {
            primary: {
              dark: colorTokens.primary[700],
              main: colorTokens.primary[500],
              light: colorTokens.primary[50],
            },
            neutral: {
              dark: colorTokens.grey[700],
              main: colorTokens.grey[500],
              mediumMain: colorTokens.grey[400],
              medium: colorTokens.grey[300],
              light: colorTokens.grey[50],
            },
            background: {
              default: colorTokens.grey[10],
              alt: colorTokens.grey[0],
            },
            success: {
              main: colorTokens.success[500],
              light: colorTokens.success[300],
              dark: colorTokens.success[700],
            },
            warning: {
              main: colorTokens.warning[500],
              light: colorTokens.warning[300],
              dark: colorTokens.warning[700],
            },
          }),
    },
    typography: {
      fontFamily: ["Rubik", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 14,
      },
    },
  };
};
