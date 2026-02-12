import { useEffect, useMemo, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline, GlobalStyles } from "@mui/material";
import { useDarkMode } from "./ColorMode";
import { THEME_DARK, THEME_LIGHT } from "../config";

const techColors = {
  primary: {
    main: "#00d4ff",
    light: "#4de0ff",
    dark: "#00a8cc",
    contrastText: "#0a0a0f",
  },
  secondary: {
    main: "#209CEE",
    light: "#4db2f5",
    dark: "#1678c4",
    contrastText: "#ffffff",
  },
  accent: {
    cyan: "#00d4ff",
    blue: "#209CEE",
    purple: "#7c3aed",
    pink: "#ec4899",
  },
};

export default function Theme({ children, options = {}, styles = {} }) {
  const { darkMode } = useDarkMode();
  const [systemMode, setSystemMode] = useState(THEME_LIGHT);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") {
      return;
    }
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      setSystemMode(mediaQuery.matches ? THEME_DARK : THEME_LIGHT);
    };
    handleChange();
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const theme = useMemo(() => {
    let htmlFontSize = 16;
    try {
      const s = window.getComputedStyle(document.documentElement).fontSize;
      htmlFontSize = parseInt(s.replace("px", ""));
    } catch (err) {
      //
    }

    const isDarkMode =
      darkMode === "dark" || (darkMode === "auto" && systemMode === THEME_DARK);

    return createTheme({
      palette: {
        mode: isDarkMode ? THEME_DARK : THEME_LIGHT,
        primary: techColors.primary,
        secondary: techColors.secondary,
        background: isDarkMode
          ? {
              default: "#0a0a0f",
              paper: "#12121a",
            }
          : {
              default: "#f8fafc",
              paper: "#ffffff",
            },
        text: isDarkMode
          ? {
              primary: "rgba(255, 255, 255, 0.92)",
              secondary: "rgba(255, 255, 255, 0.65)",
            }
          : {
              primary: "rgba(15, 23, 42, 0.95)",
              secondary: "rgba(71, 85, 105, 0.9)",
            },
        divider: isDarkMode
          ? "rgba(255, 255, 255, 0.08)"
          : "rgba(0, 0, 0, 0.08)",
        action: isDarkMode
          ? {
              active: "rgba(0, 212, 255, 0.8)",
              hover: "rgba(0, 212, 255, 0.08)",
              selected: "rgba(0, 212, 255, 0.12)",
              disabled: "rgba(255, 255, 255, 0.26)",
              disabledBackground: "rgba(255, 255, 255, 0.12)",
            }
          : {
              active: "rgba(32, 156, 238, 0.8)",
              hover: "rgba(32, 156, 238, 0.04)",
              selected: "rgba(32, 156, 238, 0.08)",
              disabled: "rgba(0, 0, 0, 0.26)",
              disabledBackground: "rgba(0, 0, 0, 0.12)",
            },
        success: {
          main: "#10b981",
          light: "#34d399",
          dark: "#059669",
        },
        warning: {
          main: "#f59e0b",
          light: "#fbbf24",
          dark: "#d97706",
        },
        error: {
          main: "#ef4444",
          light: "#f87171",
          dark: "#dc2626",
        },
        info: {
          main: "#00d4ff",
          light: "#4de0ff",
          dark: "#00a8cc",
        },
      },
      typography: {
        htmlFontSize,
        fontFamily: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
        ].join(","),
      },
      shape: {
        borderRadius: 8,
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              textTransform: "none",
              fontWeight: 500,
              transition: "all 0.2s ease",
            },
            contained: {
              background: isDarkMode
                ? "linear-gradient(135deg, #00d4ff 0%, #209CEE 100%)"
                : "linear-gradient(135deg, #209CEE 0%, #00d4ff 100%)",
              boxShadow: isDarkMode
                ? "0 2px 8px rgba(0, 212, 255, 0.3)"
                : "0 2px 8px rgba(32, 156, 238, 0.3)",
              "&:hover": {
                boxShadow: isDarkMode
                  ? "0 4px 16px rgba(0, 212, 255, 0.4)"
                  : "0 4px 16px rgba(32, 156, 238, 0.4)",
                transform: "translateY(-1px)",
              },
            },
          },
        },
        MuiTextField: {
          styleOverrides: {
            root: {
              "& .MuiOutlinedInput-root": {
                transition: "all 0.2s ease",
                "&:hover": {
                  boxShadow: isDarkMode
                    ? "0 0 0 1px rgba(0, 212, 255, 0.2)"
                    : "0 0 0 1px rgba(32, 156, 238, 0.2)",
                },
                "&.Mui-focused": {
                  boxShadow: isDarkMode
                    ? "0 0 0 2px rgba(0, 212, 255, 0.25), 0 0 12px rgba(0, 212, 255, 0.15)"
                    : "0 0 0 2px rgba(32, 156, 238, 0.25), 0 0 12px rgba(32, 156, 238, 0.15)",
                },
              },
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundImage: "none",
            },
            elevation1: {
              boxShadow: isDarkMode
                ? "0 2px 8px rgba(0, 0, 0, 0.3), 0 0 1px rgba(0, 212, 255, 0.1)"
                : "0 2px 8px rgba(0, 0, 0, 0.08)",
            },
            elevation2: {
              boxShadow: isDarkMode
                ? "0 4px 12px rgba(0, 0, 0, 0.35), 0 0 1px rgba(0, 212, 255, 0.15)"
                : "0 4px 12px rgba(0, 0, 0, 0.1)",
            },
            elevation3: {
              boxShadow: isDarkMode
                ? "0 6px 16px rgba(0, 0, 0, 0.4), 0 0 2px rgba(0, 212, 255, 0.2)"
                : "0 6px 16px rgba(0, 0, 0, 0.12)",
            },
          },
        },
        MuiIconButton: {
          styleOverrides: {
            root: {
              transition: "all 0.2s ease",
              "&:hover": {
                transform: "scale(1.05)",
              },
              "&:active": {
                transform: "scale(0.95)",
              },
            },
          },
        },
        MuiDivider: {
          styleOverrides: {
            root: {
              borderColor: isDarkMode
                ? "rgba(255, 255, 255, 0.08)"
                : "rgba(0, 0, 0, 0.08)",
            },
          },
        },
      },
      ...options,
    });
  }, [darkMode, options, systemMode]);

  const globalStyles = {
    "::-webkit-scrollbar": {
      width: 8,
      height: 8,
    },
    "::-webkit-scrollbar-track": {
      background: darkMode === "dark" ? "#1a1a24" : "#f1f5f9",
    },
    "::-webkit-scrollbar-thumb": {
      background: darkMode === "dark" 
        ? "rgba(0, 212, 255, 0.3)" 
        : "rgba(32, 156, 238, 0.3)",
      borderRadius: 4,
    },
    "::-webkit-scrollbar-thumb:hover": {
      background: darkMode === "dark" 
        ? "rgba(0, 212, 255, 0.5)" 
        : "rgba(32, 156, 238, 0.5)",
    },
    "*": {
      scrollbarWidth: "thin",
      scrollbarColor: darkMode === "dark"
        ? "rgba(0, 212, 255, 0.3) #1a1a24"
        : "rgba(32, 156, 238, 0.3) #f1f5f9",
    },
    ...styles,
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles styles={globalStyles} />
      {children}
    </ThemeProvider>
  );
}
