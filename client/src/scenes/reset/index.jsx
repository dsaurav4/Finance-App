import { Password } from "@mui/icons-material";
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Check } from "@mui/icons-material";
import { Formik } from "formik";
import { useState } from "react";
import * as yup from "yup";
import { useParams, useNavigate } from "react-router-dom";
import Alerts from "../../components/Alerts";

// validation schema for the reset code form
const resetCodeSchema = yup.object().shape({
  code: yup
    .string()
    .matches(/^\d{5}$/, "Code must be exactly digits")
    .required("Reset code is required"),
});

// validation schema for the new password form
const newPasswordSchema = yup.object().shape({
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters long")
    .matches(/[A-Z]/, "Password must contain at least 1 uppercase letter")
    .matches(/\d/, "Password must contain at least 1 digit")
    .required("New password is required"),
});

// initial values for the reset code form
const initialValuesCode = {
  code: "",
};

// initial values for the new password form
const initialValuesReset = {
  password: "",
};

/**/
/*
NAME

        Reset - a component that displays a form for resetting a user's password. 

SYNOPSIS

        Reset( { userId } );
          userId --> The ID of the user whose password is being reset.

DESCRIPTION

        This component displays a form for resetting a user's password. The form includes a reset code 
        input and a new password input. When the form is submitted, the password is reset and the user 
        is redirected to the login page.

RETURNS

        No return value.
*/
/**/
const Reset = () => {
  const { userId } = useParams();
  const { palette } = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const [alert, setAlert] = useState("");
  const [severity, setSeverity] = useState("error");
  const [alertOpen, setAlertOpen] = useState(false);

  /**/
  /*
  NAME

          handleAlertClose - a function that is called when the alert is closed. It sets the alertOpen
          state to false.

  SYNOPSIS  

          handleAlertClose( event, reason )
            event   --> The event that triggered the alert close.
            reason  --> The reason for the alert close.

  DESCRIPTION

          This function is called when the alert is closed. It sets the alertOpen state to false. 

  RETURNS

          No return value.
  */
  /**/
  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertOpen(false);
  };

  /**
   * Handles the verification of a reset code by sending a POST request to the server.
   *
   * @param {object} values - The values from the reset code form, containing the reset code.
   * @param {object} onSubmitProps - The props for the form submission.
   * @return {void}
   */
  const verifyCode = async (values, onSubmitProps) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("code", values.code);

    try {
      const response = await fetch(
        `http://localhost:3001/auth/verifyResetCode/${userId}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        setAlert(errorResponse.message || "Failed to verify code.");
        setSeverity("error");
        setAlertOpen(true);
        setLoading(false);
        return;
      }

      const successResponse = await response.json();
      setAlert(successResponse.message || "Code Verified.");
      setSeverity("success");
      setAlertOpen(true);
      onSubmitProps.resetForm();
      setIsReset(!isReset);
    } catch (error) {
      setAlert(error.message || "An error occured.");
      setSeverity("error");
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  /**/
  /*
  NAME

          changePassword - a function that is called when the form is submitted. It sends a PATCH
          request to the server to update the user's password.

  SYNOPSIS

          changePassword( values, onSubmitProps )
            values    --> The values from the form, containing the new password.
            onSubmitProps --> The props for the form submission.

  DESCRIPTION 

          This function is called when the form is submitted. It sends a PATCH request to the server
          to update the user's password. If the request is successful, the user is redirected to the
          login page. If the request fails, an error is logged to the console.

  RETURNS

          No return value.

  */
  /**/
  const changePassword = async (values, onSubmitProps) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("password", values.password);

    try {
      const response = await fetch(
        `http://localhost:3001/auth/updatePassword/${userId}`,
        {
          method: "PATCH",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        setAlert(errorResponse.message || "Failed to reset password.");
        setSeverity("error");
        setAlertOpen(true);
        setLoading(false);
        return;
      }

      setAlert("Password changed successfully!");
      setSeverity("success");
      setAlertOpen(true);
      onSubmitProps.resetForm();
      navigate("/");
    } catch (error) {
      setAlert(error.message || "An error occured.");
      setSeverity("error");
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  /**/
  /*
  NAME

          handleFormSubmit - a function that is called when the form is submitted. It calls
          either verifyCode or changePassword depending on the state of the form.

  SYNOPSIS

          handleFormSubmit( values, onSubmitProps )
            values    --> The values from the form.
            onSubmitProps --> The props for the form submission.

  DESCRIPTION

          This function is called when the form is submitted. It calls either verifyCode or
          changePassword depending on the state of the form.

  RETURNS

          No return value.

  */
  /**/
  const handleFormSubmit = (values, onSubmitProps) => {
    if (isReset) changePassword(values, onSubmitProps);
    if (!isReset) verifyCode(values, onSubmitProps);
  };

  return (
    <Box>
      {/* Header with the app name and a link to the home page */}
      <Box
        width="100%"
        backgroundColor={palette.background.alt}
        p="1rem 6%"
        textAlign="center"
      >
        <Box onClick={() => navigate("/")} sx={{ cursor: "pointer" }}>
          {" "}
          <Typography fontWeight="bold" fontSize="32px" color="inherit">
            FINANCE
          </Typography>
        </Box>
      </Box>
      {/* Form container */}
      <Box
        width={isNonMobileScreens ? "50%" : "93%"}
        p="2rem"
        m="2rem auto"
        borderRadius="1.5rem"
        backgroundColor={palette.background.alt}
      >
        {/* Success message when the code is verified */}
        <Alert
          icon={<Check fontSize="inherit" />}
          severity="success"
          sx={{ marginBottom: "1rem" }}
        >
          {isReset
            ? "Code Verified! Set your new password!"
            : "Reset Code has been sent to your email."}
        </Alert>
        {/* Form title */}
        <Typography fontWeight="500" variant="h5" sx={{ mb: "1.5rem" }}>
          Enter your {isReset ? "New Password" : "reset code"}
        </Typography>
        {/* Form */}
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={!isReset ? initialValuesCode : initialValuesReset}
          validationSchema={!isReset ? resetCodeSchema : newPasswordSchema}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
            setFieldValue,
            resetForm,
          }) => (
            <form onSubmit={handleSubmit}>
              <Box
                display="grid"
                gap="0.5rem"
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                sx={{
                  "& > div": {
                    gridColumn: isNonMobileScreens ? undefined : "span 4",
                  },
                }}
              >
                {/* Reset code input when the code is not verified */}
                {!isReset && (
                  <TextField
                    label="Reset Code"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.code}
                    name="code"
                    error={Boolean(touched.code) && Boolean(errors.code)}
                    helperText={touched.code && errors.code}
                    sx={{ gridColumn: "span 4" }}
                  />
                )}
                {/* New password input when the code is verified */}
                {isReset && (
                  <TextField
                    label="New Password"
                    type="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.password}
                    name="password"
                    error={
                      Boolean(touched.password) && Boolean(errors.password)
                    }
                    helperText={touched.password && errors.password}
                    sx={{ gridColumn: "span 4" }}
                  />
                )}
                {/* Submit button */}
                <Button
                  fullWidth
                  type="submit"
                  sx={{
                    m: "2rem 0",
                    p: "1rem",
                    backgroundColor: palette.primary.main,
                    color: palette.background.alt,
                    "&:hover": { color: palette.neutral.light },
                  }}
                >
                  {loading && (
                    <CircularProgress
                      size={24}
                      sx={{ color: palette.background.alt }}
                    />
                  )}
                  {!isReset && "VERIFY CODE"}
                  {isReset && "CHANGE PASSWORD"}
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
      {/* Alert message for any errors or success messages */}
      {alert && (
        <Alerts
          message={alert}
          severity={severity}
          open={alertOpen}
          onClose={handleAlertClose}
        />
      )}
    </Box>
  );
};

export default Reset;
