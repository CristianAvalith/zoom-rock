"use client";

import styles from "./page.module.css";
import ThemeToggleButton from "@/components/ThemeToggleButton";
import ImageWithZoom from "@/components/ImageWithZoom";
import { useState, useMemo, useEffect } from "react";
import { useTheme, Box } from "@mui/material";
import { colors } from "@/theme/colors";
import Toast from "@/components/Toast";
import LoadingOverlay from "@/components/LoadingOverlay";
import WellSelector from "@/components/WellSelector";
import api from "@/lib/axios";
import { motion, AnimatePresence } from "framer-motion";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const Home = () => {
  const theme = useTheme();
  const imagesPerPage = 13;
  const [firstRockToView, setFirstRockToView] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedWell, setSelectedWell] = useState("");
  const [wellsData, setWellsData] = useState<any>([]);
  const [rocksData, setRocksData] = useState<any>([]);

  const getListWells = async () => {
    api
      .get(`/api/v1/rock/list-wells`)
      .then((res) => {
        setWellsData(res.data.data.wells);
      })
      .catch((err) => {
        setError("Error del sistema. Por favor reinicie el navegador.");
        setSelectedWell("error");
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getListWells();
  }, []);

  const imagesToView = useMemo(() => {
    return rocksData.slice(firstRockToView, firstRockToView + imagesPerPage);
  }, [firstRockToView, rocksData]);

  const handlePrev = () => {
    setFirstRockToView((prev) => {
      return Math.max(prev - 1, 0);
    });
  };

  const handleNext = () => {
    setFirstRockToView((prev) => {
      return rocksData.length >= imagesPerPage
        ? Math.min(prev + 1, rocksData.length - 1)
        : 0;
    });
  };

  if (loading) {
    return (
      <main className={styles.main}>
        <h1>Iniciando sistemas</h1>
        <h2>Por favor, espere.</h2>
        <Toast
          open={error !== ""}
          message={error}
          severity="error"
          onClose={() => {
            setError("");
          }}
        />
        <LoadingOverlay open={loading} />
      </main>
    );
  }

  if (rocksData.length === 0 && selectedWell !== "") {
    return (
      <main className={styles.main}>
        <h1>No se pudo obtener la informacion en este momento</h1>
        <h2>
          Por favor, reinicie el navegador o intente nuevamente mas tarde.
        </h2>
        <Toast
          open={error !== ""}
          message={error}
          severity="error"
          onClose={() => {
            setError("");
          }}
        />
        <LoadingOverlay open={loading} />
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <WellSelector
        selectedWell={selectedWell}
        setSelectedWell={setSelectedWell}
        setRocksData={setRocksData}
        setError={setError}
        setLoading={setLoading}
        wellsData={wellsData}
      />

      {imagesToView.length !== 0 && (
        <section className={styles.section}>
          {rocksData.length >= imagesPerPage && (
            <Box
              component="button"
              disabled={firstRockToView === 0}
              onClick={handlePrev}
              sx={{
                all: "unset",
                cursor: "pointer",
                position: "relative",
                width: "100px",
                height: "100px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "transparent",
                overflow: "hidden",

                "&::before": {
                  content: '""',
                  position: "absolute",
                  width: 0,
                  height: 0,
                  borderTop: "50px solid transparent",
                  borderBottom: "50px solid transparent",
                  borderRight: `60px solid ${
                    theme.palette.mode === "dark"
                      ? colors.buttonDark
                      : colors.buttonLight
                  }`,
                  left: "20px",
                  opacity: 0,
                  transform: "translateX(20px)",
                  transition: "opacity 0.3s ease, transform 0.3s ease",
                },

                "&:hover::before": {
                  opacity: 1,
                  transform: "translateX(0)",
                },

                "& svg": {
                  color:
                    theme.palette.mode === "dark"
                      ? colors.textButtonLight
                      : colors.textButtonDark,
                  zIndex: 1,
                },
              }}
            >
              <ArrowBackIosNewIcon fontSize="large" />
            </Box>
          )}

          <article
            className={styles.article}
            style={{
              width:
                imagesToView.length === imagesPerPage
                  ? "calc(100vw - 200px)"
                  : `${imagesToView.length * 90 + imagesToView.length * 10}px`,
            }}
          >
            <AnimatePresence initial={false} mode="popLayout">
              {imagesToView.map((imageData: any) => (
                <motion.div
                  key={imageData?.id}
                  className={styles.imageWrapper}
                  style={{
                    width:
                      imagesToView.length === imagesPerPage ? "7.5%" : "90px",
                  }}
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -20 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                >
                  <ImageWithZoom
                    imageName={imageData?.name}
                    wellName={imageData?.well?.name}
                    setError={setError}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </article>

          {rocksData.length >= imagesPerPage && (
            <Box
              component="button"
              disabled={firstRockToView + imagesPerPage === rocksData.length}
              onClick={handleNext}
              sx={{
                all: "unset",
                cursor: "pointer",
                position: "relative",
                width: "100px",
                height: "100px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "transparent",
                overflow: "hidden",

                "&::before": {
                  content: '""',
                  position: "absolute",
                  width: 0,
                  height: 0,
                  borderTop: "50px solid transparent",
                  borderBottom: "50px solid transparent",
                  borderLeft: `60px solid ${
                    theme.palette.mode === "dark"
                      ? colors.buttonDark
                      : colors.buttonLight
                  }`,
                  right: "20px",
                  opacity: 0,
                  transform: "translateX(-20px)",
                  transition: "opacity 0.3s ease, transform 0.3s ease",
                },

                "&:hover::before": {
                  opacity: 1,
                  transform: "translateX(0)",
                },

                "& svg": {
                  color:
                    theme.palette.mode === "dark"
                      ? colors.textButtonLight
                      : colors.textButtonDark,
                  zIndex: 1,
                },
              }}
            >
              <ArrowForwardIosIcon fontSize="large" />
            </Box>
          )}
        </section>
      )}

      <ThemeToggleButton />
      <Toast
        open={error !== ""}
        message={error}
        severity="error"
        onClose={() => {
          setError("");
        }}
      />
      <LoadingOverlay open={loading} />
    </main>
  );
};

export default Home;

{
  /*
import { useRouter } from "next/navigation";
import Image from "next/image";

<Image
src="/ypf_logoazul.svg"
alt="ypf logo azul"
width={200}
height={38}
priority
/>

<Button
variant="contained"
color="primary"
sx={{ marginTop: "10px", marginBottom: "10px" }}
onClick={() => router.push("/aaaa")}
>
Ir a not found
</Button>

<ThemeToggleButton /> 

*/
}
