"use client";

import { useState } from "react";
import { useTheme } from "@mui/material";
import { colors } from "@/theme/colors";
import api from "@/lib/axios";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const WellSelector = ({
  selectedWell,
  setSelectedWell,
  setRocksData,
  setError,
  setLoading,
  wellsData,
}: any) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const getListRocks = async (wellId: string) => {
    api
      .get(`/api/v1/rock/list-rocks-by-well?wellId=${wellId}`)
      .then((res) => {
        setRocksData(res.data.data.rocks);
      })
      .catch(() => {
        setError("Error del sistema. Por favor reinicie el navegador.");
        setRocksData([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedWell(event.target.value);
    setLoading(true);
    getListRocks(event.target.value);
  };

  return (
    <FormControl
      sx={{
        minWidth: 200,
        marginTop: "20px",
        borderRadius: "10px",
        padding: "8px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
      }}
    >
      <InputLabel
        id="well-selector-label"
        sx={{
          translate: "0px 8px",
          color:
            theme.palette.mode === "dark"
              ? colors.textButtonDark
              : colors.textButtonLight,
          "&.Mui-focused": {
            translate: "0px 0px",
            color:
              theme.palette.mode === "dark"
                ? colors.textButtonDark
                : colors.textButtonLight,
          },
          "&.MuiInputLabel-shrink": {
            translate: "0px 0px",
            color:
              theme.palette.mode === "dark"
                ? colors.textButtonLight
                : colors.textButtonDark,
          },
        }}
      >
        Seleccionar Pozo
      </InputLabel>

      <Select
        labelId="well-selector-label"
        value={selectedWell}
        label="Seleccionar Pozo"
        onChange={handleChange}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        IconComponent={(props) => (
          <KeyboardArrowDownIcon
            {...props}
            sx={{
              color:
                theme.palette.mode === "dark"
                  ? colors.textButtonDark
                  : colors.textButtonLight,
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s ease",
            }}
          />
        )}
        sx={{
          borderRadius: 1,
          textAlign: "center",
          backgroundColor:
            theme.palette.mode === "dark"
              ? colors.buttonDark
              : colors.buttonLight,
          color:
            theme.palette.mode === "dark"
              ? colors.textButtonDark
              : colors.textButtonLight,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "transparent", // Sin borde por defecto
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "transparent", // Sin borde al pasar el mouse
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "transparent", // Sin borde al enfocar
          },
          "& .MuiSelect-icon": {
            color:
              theme.palette.mode === "dark"
                ? colors.textButtonDark
                : colors.textButtonLight,
          },
        }}
      >
        {wellsData.map((well: any) => (
          <MenuItem key={well.id} value={well.id}>
            {well.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default WellSelector;
