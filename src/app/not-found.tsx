"use client";

import Link from "next/link";
import { Box, Typography, Button } from "@mui/material";
import ThemeToggleButton from "@/components/ThemeToggleButton";

const NotFound = () => {
  return (
    <Box
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      textAlign="center"
    >
      <Typography variant="h2" gutterBottom>
        404 - Página no encontrada
      </Typography>
      <Typography variant="body1" gutterBottom>
        Lo sentimos, la página que buscas no existe.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        component={Link}
        href="/"
        sx={{ mt: 2, mb: 2 }}
      >
        Volver al inicio
      </Button>
      <ThemeToggleButton />
    </Box>
  );
};

export default NotFound;
