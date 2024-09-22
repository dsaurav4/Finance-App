import { Snackbar, Alert } from "@mui/material";

/**/
/*
NAME

        Alerts - displays a message in a Snackbar with a specified severity.

SYNOPSIS

        Alerts( { message, severity, open, onClose } );
            message       --> the message to be displayed in the alert.
            severity      --> the severity of the alert (e.g., "success", "error").
            open          --> boolean indicating whether the alert is open.
            onClose       --> function to call when the alert is closed.

DESCRIPTION

        This function renders a Snackbar component from MUI, displaying an alert
        with a message and severity level. The alert will automatically close after
        8 seconds unless closed manually. The alert is positioned at the bottom right
        corner of the screen.

RETURNS

        No return value.
*/
/**/
const Alerts = ({ message, severity, open, onClose }) => {
  return (
    <Snackbar
      // Automatically close the alert after 8 seconds
      open={open}
      autoHideDuration={8000}
      onClose={onClose}
      // Display the alert in the bottom right corner of the screen
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert
        // Allow the user to close the alert by clicking on it
        onClose={onClose}
        // Set the severity of the alert
        severity={severity}
      >
        {/* Display the message in the alert */}
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Alerts;
