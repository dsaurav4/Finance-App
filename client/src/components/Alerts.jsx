import { Snackbar, Alert } from "@mui/material";

const Alerts = ({ message, severity, open, onClose }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={8000}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert onClose={onClose} severity={severity}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Alerts;
