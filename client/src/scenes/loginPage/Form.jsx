import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
  CircularProgress,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "../../state";
import Dropzone from "react-dropzone";
import FlexBetween from "../../components/FlexBetween";
import Alerts from "../../components/Alerts";

// schema for register form
const registerSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  username: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters long")
    .matches(/[A-Z]/, "Password must contain at least 1 uppercase letter")
    .matches(/\d/, "Password must contain at least 1 digit")
    .required("Password is required"),
  picture: yup.mixed().required("Picture is required"),
});

// schema for login form
const loginSchema = yup.object().shape({
  username: yup.string().required("required"),
  password: yup.string().required("required"),
});

// schema for forgot password form
const forgotPasswordSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
});

// initial values for register form
const initialValuesRegister = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  password: "",
  picture: "",
};

// initial values for login form
const initialValuesLogin = {
  username: "",
  password: "",
};

// initial values for forgot password form
const initialValuesForgotPassword = {
  email: "",
};

/**/
/*
NAME
    Form - A reusable form component.

SYNOPSIS
    Form({ pageType, setPageType })
        pageType      --> string indicating the type of form. This can be "login", "register", or "forgotPassword".
        setPageType   --> function to set the type of form. This is used to switch between login, register, and forgot password forms.


DESCRIPTION
    A reusable form component. This component is used to display a login, register,
    forgot password, or reset password form.

RETURNS
    The form component.
*/
/**/
const Form = ({ pageType, setPageType }) => {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("error");
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";
  const isForgotPassword = pageType == "forgotPassword";

  /**/
  /*
  NAME
      register - Handles the registration of a new user by sending a POST request to the server with the provided form data.  

  SYNOPSIS
      register(values, onSubmitProps)
          values        --> The values from the register form.
          onSubmitProps --> The onSubmitProps from the register form.

  DESCRIPTION
      Handles the registration of a new user by sending a POST request to the server with the provided form data.  

  RETURNS
      No return value.
  */
  /**/

  const register = async (values, onSubmitProps) => {
    setLoading(true);
    const formData = new FormData();
    for (let value in values) {
      formData.append(value, values[value]);
    }

    try {
      const savedUserResponse = await fetch(
        "http://localhost:3001/auth/register",
        {
          method: "POST",
          body: formData,
        }
      );

      if (savedUserResponse.status != 201) {
        const data = await savedUserResponse.json();
        setAlert(data.message);
        setAlertSeverity("error");
        setAlertOpen(true);
        setLoading(false);
        return;
      }

      const savedUser = await savedUserResponse.json();

      onSubmitProps.resetForm();
      if (savedUser) {
        setAlert(savedUser.message);
        setAlertSeverity("success");
        setPageType("login");
        setAlertOpen(true);
      }
    } catch (err) {
      console.error(err);
      setAlert("An error occurred during registration. Please try again.");
      setAlertSeverity("error");
    } finally {
      setLoading(false);
    }
  };

  /**/
  /*
  NAME
      login - Handles the login of an existing user by sending a POST request to the server with the provided form data.

  SYNOPSIS
      login(values, onSubmitProps)
          values        --> The values from the login form.
          onSubmitProps --> The onSubmitProps from the login form.

  DESCRIPTION
      Handles the login of an existing user by sending a POST request to the server with the provided form data.

  RETURNS
      No return value.
  */
  /**/
  const login = async (values, onSubmitProps) => {
    setLoading(true);
    try {
      const loggedInResponse = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (loggedInResponse.status != 200) {
        const data = await loggedInResponse.json();
        setAlert(data.message);
        setAlertSeverity("error");
        setAlertOpen(true);
        onSubmitProps.resetForm();
        setLoading(false);
        return;
      }

      const loggedIn = await loggedInResponse.json();

      if (loggedIn) {
        dispatch(
          setLogin({
            user: loggedIn.user,
            token: loggedIn.token,
          })
        );
        setAlert("");
        navigate("/dashboard");
        onSubmitProps.resetForm();
      }
    } catch (err) {
      console.error(err);
      setAlert("An error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /**/
  /*
  NAME
      resetPassword - Handles the reset of the password of an existing user by sending a POST request to the server with the provided form data.  

  SYNOPSIS
      resetPassword(values, onSubmitProps)
          values        --> The values from the reset password form.
          onSubmitProps --> The onSubmitProps from the reset password form.

  DESCRIPTION
      Handles the reset of the password of an existing user by sending a POST request to the server with the provided form data.

  RETURNS
      No return value.
  */
  /**/
  const resetPassword = async (values, onSubmitProps) => {
    setLoading(true);
    const formData = new FormData();

    formData.append("email", values.email);

    try {
      const resetPasswordResponse = await fetch(
        "http://localhost:3001/auth/resetPassword",
        {
          method: "POST",
          body: formData,
        }
      );

      if (resetPasswordResponse.status != 200) {
        const data = await resetPasswordResponse.json();
        setAlert(data.message);
        setAlertSeverity("error");
        setAlertOpen(true);
        onSubmitProps.resetForm();
        setLoading(false);
        return;
      }

      const userId = await resetPasswordResponse.json();
      navigate(`/reset/${userId}`);
      return;
    } catch (error) {
      setAlert(error.message);
      setAlertSeverity("error");
      setAlertOpen(true);
      onSubmitProps.resetForm();
      return;
    } finally {
      setLoading(false);
    }
  };

  /**/
  /*
  NAME
      handleFormSubmit - Handles the submission of the form by either logging in or registering a new user.

  SYNOPSIS  
      handleFormSubmit(values, onSubmitProps)
          values        --> The values from the form.
          onSubmitProps --> The onSubmitProps from the form.

  DESCRIPTION
      Handles the submission of the form by either logging in or registering a new user.

  RETURNS
      No return value.
  */
  /**/
  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps);
    if (isRegister) await register(values, onSubmitProps);
    if (isForgotPassword) await resetPassword(values, onSubmitProps);
  };

  /**/
  /*
  NAME
      handleAlertClose - Handles the closing of an alert by checking the reason for the close event.

  SYNOPSIS
      handleAlertClose(event, reason)
          event --> The event that triggered the close.
          reason --> The reason for the close.

  DESCRIPTION
      Handles the closing of an alert by checking the reason for the close event.

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

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={
        (isLogin && initialValuesLogin) ||
        (isRegister && initialValuesRegister) ||
        (isForgotPassword && initialValuesForgotPassword)
      }
      validationSchema={
        (isLogin && loginSchema) ||
        (isRegister && registerSchema) ||
        (isForgotPassword && forgotPasswordSchema)
      }
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
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
            {/* REGISTER FIELDS */}
            {isRegister && (
              <>
                <TextField
                  label="First Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.firstName}
                  name="firstName"
                  error={
                    Boolean(touched.firstName) && Boolean(errors.firstName)
                  }
                  helperText={touched.firstName && errors.firstName}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="Last Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.lastName}
                  name="lastName"
                  error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                  sx={{ gridColumn: "span 2" }}
                />

                <Box
                  gridColumn="span 4"
                  border={`1px solid ${palette.neutral.medium}`}
                  borderRadius="5px"
                  p="1rem"
                >
                  <Dropzone
                    acceptedFiles=".jpg,.jpeg,.png"
                    multiple={false}
                    onDrop={(acceptedFiles) =>
                      setFieldValue("picture", acceptedFiles[0])
                    }
                  >
                    {({ getRootProps, getInputProps }) => (
                      <Box
                        {...getRootProps()}
                        border={`2px dashed ${palette.primary.main}`}
                        p="1rem"
                        sx={{ "&:hover": { cursor: "pointer" } }}
                      >
                        <input {...getInputProps()} />
                        {values.picture ? (
                          <FlexBetween>
                            <img
                              src={URL.createObjectURL(values.picture)}
                              alt={values.picture.name}
                              style={{ width: "100px", height: "auto" }}
                            />
                            <Typography>{values.picture.name}</Typography>
                            <EditOutlinedIcon />
                          </FlexBetween>
                        ) : (
                          <p>Add Picture Here</p>
                        )}
                      </Box>
                    )}
                  </Dropzone>
                </Box>
              </>
            )}
            {/* EMAIL */}
            {(isForgotPassword || isRegister) && (
              <TextField
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={Boolean(touched.email) && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 4" }}
              />
            )}
            {/* USERNAME AND PASSWORD */}
            {(isLogin || isRegister) && (
              <>
                <TextField
                  label="Username"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.username}
                  name="username"
                  error={Boolean(touched.username) && Boolean(errors.username)}
                  helperText={touched.username && errors.username}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  label="Password"
                  type="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  name="password"
                  error={Boolean(touched.password) && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  sx={{ gridColumn: "span 4" }}
                />
              </>
            )}
          </Box>

          {/* BUTTONS */}
          <Box>
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
              {loading ? (
                <CircularProgress
                  size={24}
                  sx={{ color: palette.background.alt }}
                />
              ) : isLogin ? (
                "LOGIN"
              ) : isRegister ? (
                "REGISTER"
              ) : (
                "Send Code"
              )}
            </Button>
            <FlexBetween>
              {(isLogin || isRegister) && (
                <Typography
                  onClick={() => {
                    setPageType(isLogin ? "register" : "login");
                    resetForm();
                  }}
                  sx={{
                    textDecoration: "underline",
                    color: "inherit",
                    "&:hover": {
                      cursor: "pointer",
                      color: palette.primary.light,
                    },
                  }}
                >
                  {isLogin &&
                    `${
                      isNonMobile ? "Don't have an account?" : ""
                    } Sign Up here.`}
                  {isRegister && "Already have an account? Login here."}
                </Typography>
              )}
              {isLogin && (
                <Typography
                  onClick={() => {
                    setPageType("forgotPassword");
                    resetForm();
                  }}
                  sx={{
                    textDecoration: "underline",
                    color: "inherit",
                    "&:hover": {
                      cursor: "pointer",
                      color: palette.primary.light,
                    },
                  }}
                >
                  Forgot Password
                </Typography>
              )}
              {isForgotPassword && (
                <Typography
                  onClick={() => {
                    setPageType("login");
                    resetForm();
                  }}
                  sx={{
                    textDecoration: "underline",
                    color: "inherit",
                    "&:hover": {
                      cursor: "pointer",
                      color: palette.primary.light,
                    },
                  }}
                >
                  Nevermind
                </Typography>
              )}
            </FlexBetween>
            {alert && (
              <Alerts
                message={alert}
                severity={alertSeverity}
                open={alertOpen}
                onClose={handleAlertClose}
              />
            )}
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default Form;
