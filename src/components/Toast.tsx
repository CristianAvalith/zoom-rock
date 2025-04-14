import React from "react";
import { Snackbar, Alert } from "@mui/material";

interface ToastProps {
  message: string;
  severity?: "success" | "error" | "warning" | "info";
  open: boolean;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({
  message,
  severity = "info",
  open,
  onClose,
}) => {
  return (
    <Snackbar open={open} autoHideDuration={3000} onClose={onClose}>
      <Alert severity={severity} sx={{ width: "420px", fontSize: "1.2rem" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Toast;

// import Toast from "@/components/Toast";

// const [success, setSuccess] = useState("");
// const [error, setError] = useState("");
// const [warning, setWarning] = useState("");
// const [info, setInfo] = useState("");

// <Toast
// open={success !== ""}
// message={success}
// severity="success"
// onClose={() => {
//   setSuccess("");
// }}
// />

// <Toast
// open={error !== ""}
// message={error}
// severity="error"
// onClose={() => {
//   setError("");
// }}
// />

// <Toast
// open={warning !== ""}
// message={warning}
// severity="warning"
// onClose={() => {
//   setWarning("");
// }}
// />

// <Toast
// open={info !== ""}
// message={info}
// severity="info"
// onClose={() => {
//   setInfo("");
// }}
// />
