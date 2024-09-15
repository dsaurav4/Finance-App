import { useState } from "react";
import {
  useTheme,
  useMediaQuery,
  Box,
  TextField,
  Typography,
  Button,
  InputAdornment,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import * as yup from "yup";
import { Formik } from "formik";
import WidgetWrapper from "../../components/WidgetWrapper.jsx";
import FlexBetween from "../../components/FlexBetween.jsx";
import Alerts from "../../components/Alerts.jsx";
import { setSavingGoals } from "../../state/index.js";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

const savingGoalSchema = yup.object().shape({
  goalName: yup.string().required("Goal Name is required"),
  targetAmount: yup
    .number()
    .typeError("Target Amount must be a number")
    .required("Target Amount is required")
    .min(1, "Target Amount cannot be negative or zero"),
  startDate: yup
    .date()
    .typeError("Start Date must be a valid date")
    .required("Start Date is required"),
  endDate: yup
    .date()
    .typeError("End Date must be a valid date")
    .required("End Date is required")
    .min(yup.ref("startDate"), "End date must not be prior to start date."),
});

const initialSavingGoalValues = {
  goalName: "",
  targetAmount: "",
  startDate: null,
  endDate: null,
};

const AddSavingGoal = () => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const [alert, setAlert] = useState("");
  const [severity, setSeverity] = useState("error");
  const [alertOpen, setAlertOpen] = useState(false);

  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertOpen(false);
  };

  const goalsList = ["car", "house", "vacation", "college fund", "retirement"];
  const [currentGoalIndex, setCurrentGoalIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentGoalIndex((prevIndex) => (prevIndex + 1) % goalsList.length);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [goalsList.length]);

  const handleFormSubmit = async (values, onSubmitProps) => {
    const formData = new FormData();
    formData.append("goalName", values.goalName);
    formData.append("targetAmount", values.targetAmount);
    formData.append("startDate", values.startDate);
    formData.append("endDate", values.endDate);

    try {
      const response = await fetch(`http://localhost:3001/savingGoals/${_id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        setAlert(errorResponse.message || "Failed to save budget.");
        setSeverity("error");
        setAlertOpen(true);
        return;
      }

      const savingGoals = await response.json();
      dispatch(setSavingGoals({ savingGoals }));
      setAlert("Saving Goal saved successfully.");
      setSeverity("success");
      setAlertOpen(true);
      onSubmitProps.resetForm();
    } catch (error) {
      setAlert("An error occurred. Please try again.");
      setSeverity("error");
      setAlertOpen(true);
    }
  };

  return (
    <>
      <WidgetWrapper
        sx={{
          paddingBottom: "3rem",
          marginX: `${isNonMobileScreens ? "12.5%" : undefined}`,
        }}
      >
        <FlexBetween
          sx={{
            justifyContent: "center",
            marginBottom: "2rem",
          }}
        >
          <Typography
            sx={{
              fontWeight: "bolder",
              textTransform: "uppercase",
              textAlign: "center",
            }}
            variant="h3"
          >
            Start saving for your <br></br>
            <span
              style={{
                color: "#4CAF50",
                transition: "opacity 0.5s ease-in-out",
                opacity: 1,
                alignContent: "center",
              }}
            >
              {goalsList[currentGoalIndex]}
            </span>
          </Typography>
        </FlexBetween>
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={initialSavingGoalValues}
          validationSchema={savingGoalSchema}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
            setFieldValue,
          }) => (
            <form onSubmit={handleSubmit}>
              <Box
                display="grid"
                gap="30px"
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                sx={{
                  "& > div": {
                    gridColumn: isNonMobileScreens ? undefined : "span 4",
                  },
                }}
              >
                <TextField
                  label="Goal Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.goalName}
                  name="goalName"
                  error={Boolean(touched.goalName) && Boolean(errors.goalName)}
                  helperText={touched.goalName && errors.goalName}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="Target Amount"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.targetAmount}
                  name="targetAmount"
                  error={
                    Boolean(touched.targetAmount) &&
                    Boolean(errors.targetAmount)
                  }
                  helperText={touched.targetAmount && errors.targetAmount}
                  sx={{ gridColumn: "span 2" }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                />
                <Box sx={{ gridColumn: "span 2" }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Start Date"
                      value={values.startDate}
                      onChange={(newValue) => {
                        setFieldValue("startDate", newValue);
                      }}
                      slotProps={{
                        textField: {
                          onBlur: handleBlur,
                          name: "startDate",
                          error:
                            Boolean(touched.startDate) &&
                            Boolean(errors.startDate),
                          helperText: touched.startDate && errors.startDate,
                          fullWidth: true,
                        },
                      }}
                      minDate={dayjs()}
                    />
                  </LocalizationProvider>
                </Box>
                <Box sx={{ gridColumn: "span 2" }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Due Date"
                      value={values.endDate}
                      onChange={(newValue) => {
                        setFieldValue("endDate", newValue);
                      }}
                      slotProps={{
                        textField: {
                          onBlur: handleBlur,
                          name: "endDate",
                          error:
                            Boolean(touched.endDate) && Boolean(errors.endDate),
                          helperText: touched.endDate && errors.endDate,
                          fullWidth: true,
                        },
                      }}
                      minDate={dayjs(values.startDate)}
                    />
                  </LocalizationProvider>
                </Box>
                <Button
                  fullWidth
                  type="submit"
                  sx={{
                    gridColumn: "span 4",
                    p: "1rem",
                    backgroundColor: palette.primary.main,
                    color: palette.background.alt,
                    "&:hover": { color: palette.neutral.light },
                  }}
                >
                  Add Saving Goal
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </WidgetWrapper>
      {alert && (
        <Alerts
          message={alert}
          severity={severity}
          open={alertOpen}
          onClose={handleAlertClose}
        />
      )}
    </>
  );
};

export default AddSavingGoal;
