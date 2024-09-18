import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
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
    .required("New password is required"),
  picture: yup.mixed().required("Picture is required"),
});

const loginSchema = yup.object().shape({
  username: yup.string().required("required"),
  password: yup.string().required("required"),
});

const forgotPasswordSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
});

const initialValuesRegister = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  password: "",
  picture: "",
};

const initialValuesLogin = {
  username: "",
  password: "",
};

const initialValuesForgotPassword = {
  email: "",
};

const Form = ({ pageType, setPageType }) => {
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

  const register = async (values, onSubmitProps) => {
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
    }
  };

  const login = async (values, onSubmitProps) => {
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
    }
  };

  const resetPassword = async (values, onSubmitProps) => {
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
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps);
    if (isRegister) await register(values, onSubmitProps);
    if (isForgotPassword) await resetPassword(values, onSubmitProps);
  };

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
              {isLogin && "LOGIN"}
              {isRegister && "REGISTER"}
              {isForgotPassword && "Send Code"}
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
