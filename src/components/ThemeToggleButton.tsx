"use client";

import { IconButton, Tooltip } from "@mui/material";
import { useColorMode } from "@/theme/ColorModeContext";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

export default function ThemeToggleButton() {
  const { toggleColorMode, mode } = useColorMode();

  return (
    <Tooltip title={`Cambiar a modo ${mode === "light" ? "oscuro" : "claro"}`}>
      <IconButton color="inherit" onClick={toggleColorMode}>
        {mode === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
      </IconButton>
    </Tooltip>
  );
}
