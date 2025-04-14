"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { PaletteMode } from "@mui/material";

interface Props {
  children: React.ReactNode;
}

interface ThemeContextType {
  toggleColorMode: () => void;
  mode: PaletteMode;
}

const ColorModeContext = createContext<ThemeContextType | undefined>(undefined);

export const useColorMode = () => {
  const context = useContext(ColorModeContext);
  if (!context)
    throw new Error("useColorMode must be used within ColorModeProvider");
  return context;
};

export default function ColorModeProvider({ children }: Props) {
  const [mode, setMode] = useState<PaletteMode>("light"); // por defecto: dark

  // Cargar desde localStorage
  useEffect(() => {
    const storedMode = localStorage.getItem("themeMode") as PaletteMode | null;
    if (storedMode) {
      setMode(storedMode);
    }
  }, []);

  const toggleColorMode = () => {
    setMode((prevMode) => {
      const newMode = prevMode === "light" ? "dark" : "light";
      localStorage.setItem("themeMode", newMode);
      return newMode;
    });
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          // primary: {
          //   main: mode === "light" ? "#0f0f0f" : "#0f0f0f",
          // },
          // secondary: {
          //   main: mode === "light" ? "#0f0f0f" : "#0f0f0f",
          // },
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={{ toggleColorMode, mode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
