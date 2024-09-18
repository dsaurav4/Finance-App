import { Password } from "@mui/icons-material";
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import { Check } from "@mui/icons-material";
import { Formik } from "formik";
import { useState } from "react";
import * as yup from "yup";
import { useParams, useNavigate } from "react-router-dom";
import Alerts from "../../components/Alerts";

const resetCodeSchema = yup.object().shape({
  code: yup
    .string()
    .matches(/^\d{5}$/, "Code must be exactly digits")
    .required("Reset code is required"),
});

const newPasswordSchema = yup.object().shape({
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters long")
    .matches(/[A-Z]/, "Password must contain at least 1 uppercase letter")
    .matches(/\d/, "Password must contain at least 1 digit")
    .required("New password is required"),
});

const initialValuesCode = {
  code: "",
};

const initialValuesReset = {
  password: "",
};

const Reset = () => {
  const { userId } = useParams();
  const { palette } = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();

  const [isReset, setIsReset] = useState(false);
  const [alert, setAlert] = useState("");
  const [severity, setSeverity] = useState("error");
  const [alertOpen, setAlertOpen] = useState(false);

  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertOpen(false);
  };

  const verifyCode = async (values, onSubmitProps) => {
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
    }
  };

  const changePassword = async (values, onSubmitProps) => {
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
    }
  };
  const handleFormSubmit = (values, onSubmitProps) => {
    if (isReset) changePassword(values, onSubmitProps);
    if (!isReset) verifyCode(values, onSubmitProps);
  };

  return (
    <Box>
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
      <Box
        width={isNonMobileScreens ? "50%" : "93%"}
        p="2rem"
        m="2rem auto"
        borderRadius="1.5rem"
        backgroundColor={palette.background.alt}
      >
        <Alert
          icon={<Check fontSize="inherit" />}
          severity="success"
          sx={{ marginBottom: "1rem" }}
        >
          {isReset
            ? "Code Verified! Set your new password!"
            : "Reset Code has been sent to your email."}
        </Alert>
        <Typography fontWeight="500" variant="h5" sx={{ mb: "1.5rem" }}>
          Enter your {isReset ? "New Password" : "reset code"}
        </Typography>
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
                {isReset && (
                  <TextField
                    label="New Password"
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
                  {!isReset && "VERIFY CODE"}
                  {isReset && "CHANGE PASSWORD"}
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
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
