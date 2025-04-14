"use client";

import { useEffect, useRef } from "react";
import styles from "@/app/page.module.css";
import { useTheme } from "@mui/material";
import { colors } from "@/theme/colors";
import OpenSeadragon from "openseadragon";
import api from "@/lib/axios";

interface Props {
  imageName: string;
  wellName: string;
  setError: any;
}

const ImageWithZoom = ({ imageName, wellName, setError }: Props) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const osdViewer = useRef<ReturnType<typeof OpenSeadragon> | null>(null);
  const theme = useTheme();

  useEffect(() => {
    if (typeof window !== "undefined" && viewerRef.current) {
      let viewer: any;

      if (viewerRef.current) {
        import("openseadragon").then((OpenSeadragonData) => {
          viewer = OpenSeadragonData.default({
            element: viewerRef.current!,
            prefixUrl: "https://openseadragon.github.io/openseadragon/images/",
            tileSources: `${process.env.NEXT_PUBLIC_URL_BACKEND}/api/v1/rock/get-dzi?wellName=${wellName}&fileName=${imageName}`,
            showNavigator: true,
            crossOriginPolicy: "Anonymous",
            gestureSettingsMouse: {
              scrollToZoom: true,
              clickToZoom: false,
            },
            zoomPerScroll: 1.2,
            showNavigationControl: false,
            showHomeControl: false,
            showZoomControl: false,
            showFullPageControl: false,
            drawer: "canvas",
          });

          viewer.addHandler("open", () => {
            api
              .get(`/api/v1/rock/list-marks?rockName=${imageName}`)
              .then((res) => {
                if (Array.isArray(res.data.data.marks)) {
                  res.data.data.marks.forEach((mark: any) => {
                    const marker = document.createElement("div");
                    marker.style.width = "15px";
                    marker.style.height = "15px";
                    marker.style.background = "#C5CBBF";
                    marker.style.borderRadius = "50%";
                    marker.style.border = "3px solid #1F3D33";
                    marker.style.position = "absolute";
                    marker.style.cursor = "pointer";
                    marker.style.pointerEvents = "auto";
                    marker.style.zIndex = "1000";
                    marker.title = mark.title || "";

                    const innerDot = document.createElement("div");
                    innerDot.style.width = "6px";
                    innerDot.style.height = "6px";
                    innerDot.style.background = "#1F3D33";
                    innerDot.style.borderRadius = "50%";
                    innerDot.style.margin = "auto";
                    innerDot.style.position = "relative";
                    innerDot.style.top = "50%";
                    innerDot.style.transform = "translateY(-50%)";

                    marker.appendChild(innerDot);

                    viewer.addOverlay({
                      element: marker,
                      location: new OpenSeadragon.Point(mark.x, mark.y),
                      placement: OpenSeadragon.Placement.CENTER,
                      checkResize: false,
                    });
                  });
                }
              })
              .catch(() => {
                setError(
                  "Error al cargar las marcas. Por favor reinicie el navegador."
                );
              });
          });

          viewer.addHandler("canvas-double-click", async (event: any) => {
            const point = viewer.viewport.pointFromPixel(event.position);
            const marker = document.createElement("div");
            marker.style.width = "15px";
            marker.style.height = "15px";
            marker.style.background = "#C5CBBF";
            marker.style.borderRadius = "50%";
            marker.style.border = "3px solid #1F3D33";
            marker.style.position = "absolute";
            marker.title = `${point.x.toFixed(2)}, ${point.y.toFixed(2)}`;

            const innerDot = document.createElement("div");
            innerDot.style.width = "6px";
            innerDot.style.height = "6px";
            innerDot.style.background = "#1F3D33";
            innerDot.style.borderRadius = "50%";
            innerDot.style.margin = "auto";
            innerDot.style.position = "relative";
            innerDot.style.top = "50%";
            innerDot.style.transform = "translateY(-50%)";

            marker.appendChild(innerDot);

            viewer.addOverlay({
              element: marker,
              location: point,
              checkResize: false,
            });
            api
              .post(`/api/v1/rock/save-mark`, {
                x: point.x,
                y: point.y,
                rockName: imageName,
                title: `${point.x.toFixed(2)}, ${point.y.toFixed(2)}`,
              })
              .catch(() => {
                setError("Error al crear la nueva marca.");
              });
          });

          viewer.addHandler("tile-drawn", () => {
            if (!osdViewer.current) {
              osdViewer.current = viewer;
            }
          });
        });
      }
    }
  }, [imageName, setError, wellName]);

  const zoomIn = () => {
    osdViewer.current?.viewport.zoomBy(1.2);
    osdViewer.current?.viewport.applyConstraints();
  };

  const zoomOut = () => {
    osdViewer.current?.viewport.zoomBy(0.8);
    osdViewer.current?.viewport.applyConstraints();
  };

  const resetView = () => {
    osdViewer.current?.viewport.goHome();
  };

  const toggleFullscreen = () => {
    if (typeof document === "undefined") return; // Verifica si 'document' está disponible
  
    const element = viewerRef.current;
    if (!element) return;
  
    if (!document.fullscreenElement) {
      element
        .requestFullscreen()
        .catch((err) => {
          console.error(`Error al entrar en fullscreen: ${err.message}`);
        });
    } else {
      document.exitFullscreen();
    }
  };
  return (
    <div
      ref={viewerRef}
      className={styles.ImageContainer}
      style={{
        borderColor:
          theme.palette.mode === "dark"
            ? colors.secondaryDark
            : colors.secondaryLight,
      }}
    >
      <div className={styles.controls}>
        <button
          className={styles.button}
          onClick={zoomIn}
          title="Mas zoom"
          style={{
            backgroundColor:
              theme.palette.mode === "dark"
                ? colors.buttonDark
                : colors.buttonLight,
          }}
        >
          <svg
            fill="none"
            stroke="currentColor"
            style={{
              color:
                theme.palette.mode === "dark"
                  ? colors.textButtonDark
                  : colors.textButtonLight,
            }}
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M12 5v14m-7-7h14" />
          </svg>
        </button>
        <button
          className={styles.button}
          onClick={zoomOut}
          title="Menos zoom"
          style={{
            backgroundColor:
              theme.palette.mode === "dark"
                ? colors.buttonDark
                : colors.buttonLight,
          }}
        >
          <svg
            fill="none"
            stroke="currentColor"
            style={{
              color:
                theme.palette.mode === "dark"
                  ? colors.textButtonDark
                  : colors.textButtonLight,
            }}
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M5 12h14" />
          </svg>
        </button>
        <button
          className={styles.button}
          onClick={resetView}
          title="Reiniciar vista"
          style={{
            backgroundColor:
              theme.palette.mode === "dark"
                ? colors.buttonDark
                : colors.buttonLight,
          }}
        >
          <svg
            fill="none"
            stroke="currentColor"
            style={{
              color:
                theme.palette.mode === "dark"
                  ? colors.textButtonDark
                  : colors.textButtonLight,
            }}
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M3 12a9 9 0 1 0 9-9v2.5" />
          </svg>
        </button>
        <button
          className={styles.button}
          onClick={toggleFullscreen}
          title="Pantalla completa"
          style={{
            backgroundColor:
              theme.palette.mode === "dark"
                ? colors.buttonDark
                : colors.buttonLight,
          }}
        >
          <svg
            fill="none"
            stroke="currentColor"
            style={{
              color:
                theme.palette.mode === "dark"
                  ? colors.textButtonDark
                  : colors.textButtonLight,
            }}
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ImageWithZoom;
