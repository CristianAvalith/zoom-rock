"use client";

import { CircularProgress, Box } from "@mui/material";

interface LoadingOverlayProps {
  open: boolean;
}

const LoadingOverlay = ({ open }: LoadingOverlayProps) => {
  if (!open) return null;

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgcolor="rgba(0, 0, 0, 0.4)"
      zIndex={1300} // mayor que los tooltips/dialogs de MUI
    >
      <CircularProgress style={{ color: "#fff" }} />
    </Box>
  );
};

export default LoadingOverlay;
