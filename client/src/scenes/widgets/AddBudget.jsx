import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useTheme,
  useMediaQuery,
  Box,
  TextField,
  Typography,
  Button,
  MenuItem,
  FormControl,
  Select,
  InputAdornment,
  InputLabel,
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
import { setBudgets } from "../../state/index.js";
import { addDays } from "date-fns";

// validation schema for budget form
const budgetSchema = yup.object().shape({
  period: yup
    .string()
    .oneOf(["Weekly", "Monthly"], "Invalid Period")
    .required("Period is required"),
  amount: yup
    .number()
    .typeError("Amount must be a number")
    .required("Amount is required")
    .min(1, "Amount cannot be negative or zero"),
  noOfPeriod: yup
    .string()
    .oneOf(["1", "2", "3", "4", "5", "6"], "Invalid Length of Period")
    .required("End Period is required!"),
  startDate: yup
    .date()
    .typeError("Date must be a valid date")
    .required("Date is required"),
});

// initial values for budget form
const initialBudgetValues = {
  period: "",
  amount: "",
  noOfPeriod: "",
  startDate: null,
};

/**/
/*
NAME

        AddBudget - a component for adding a new budget to the user's account.

SYNOPSIS

        AddBudget();

DESCRIPTION

        This component allows the user to create a new budget by filling out a form.
        The user can select the budget period (Weekly or Monthly), specify the amount,
        and choose the number of periods. Upon form submission, the data is sent to
        the server via a POST request.

        The handleFormSubmit function is responsible for processing the form submission.
        It creates a FormData object, appends the form values, calculates the budget end
        date, and sends the data to the server. If the server responds successfully,
        the Redux state is updated with the new budget data. In case of an error, an 
        alert is displayed.

RETURNS

        Returns JSX elements that render the form and handle budget creation.
*/
/**/
const AddBudget = () => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const [alert, setAlert] = useState("");
  const [severity, setSeverity] = useState("error");
  const [alertOpen, setAlertOpen] = useState(false);

  const budgetPeriods = ["Weekly", "Monthly"];
  const periodLength = ["1", "2", "3", "4", "5", "6"];

  /**/
  /*
  NAME

          handleFormSubmit - a function that handles the form submission for adding a new budget.

  SYNOPSIS

          handleFormSubmit(values, onSubmitProps);
            values        --> the form values submitted by the user.
            onSubmitProps --> the formik props for resetting the form.

  DESCRIPTION

          This function is called when the user submits the budget form. It creates a FormData
          object, appends the form values, calculates the budget end date, and sends the data
          to the server via a POST request. If the server responds successfully, the Redux state
          is updated with the new budget data. In case of an error, an alert is displayed.

  RETURNS

          Returns void.

  */
  /**/
  const handleFormSubmit = async (values, onSubmitProps) => {
    const formData = new FormData();
    formData.append("period", values.period);
    formData.append("amount", values.amount);
    formData.append("startDate", new Date(values.startDate));
    const endDate = calculateEndDate(
      values.startDate,
      values.period,
      parseInt(values.noOfPeriod, 10)
    );
    formData.append("endDate", endDate);

    try {
      const response = await fetch(
        `http://localhost:3001/budgets/${_id}/budgets`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        setAlert(errorResponse.message || "Failed to save budget.");
        setSeverity("error");
        setAlertOpen(true);
        return;
      }

      const budgets = await response.json();
      dispatch(setBudgets({ budgets }));

      setAlert("Budget saved successfully.");
      setSeverity("success");
      setAlertOpen(true);
      onSubmitProps.resetForm();
    } catch (error) {
      setAlert("An error occurred. Please try again.");
      setSeverity("error");
      setAlertOpen(true);
    }
  };

  /**/
  /*
  NAME

          handleAlertClose - a function that handles the closing of the alert.

  SYNOPSIS

          handleAlertClose(event, reason);
            event  --> the event object.
            reason --> the reason for closing the alert.

  DESCRIPTION

          This function is called when the user closes the alert. It sets the alertOpen
          state to false, hiding the alert. The alert can also be closed by clicking
          outside the alert.

  RETURNS

          Returns void.

  */
  /**/

  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertOpen(false);
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
            Add a New Budget
          </Typography>
        </FlexBetween>
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={initialBudgetValues}
          validationSchema={budgetSchema}
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
                <Box sx={{ gridColumn: "span 2" }}>
                  {/* Period field */}
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Period
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={values.period}
                      label="Period"
                      onChange={(e) => {
                        handleChange(e);
                      }}
                      onBlur={handleBlur}
                      name="period"
                    >
                      {budgetPeriods.map((period) => (
                        <MenuItem value={period} key={period}>
                          {period}
                        </MenuItem>
                      ))}
                    </Select>
                    {touched.period && errors.period && (
                      <Typography variant="caption" color="error">
                        {errors.period}
                      </Typography>
                    )}
                  </FormControl>
                </Box>
                <TextField
                  label="Amount"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.amount}
                  name="amount"
                  error={Boolean(touched.amount) && Boolean(errors.amount)}
                  helperText={touched.amount && errors.amount}
                  sx={{ gridColumn: "span 2" }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                />
                <Box sx={{ gridColumn: "span 2" }}>
                  {/* Period length field */}
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Period Length
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={values.noOfPeriod}
                      label="Period Length"
                      onChange={(e) => {
                        handleChange(e);
                      }}
                      onBlur={handleBlur}
                      name="noOfPeriod"
                      disabled={!values.period}
                    >
                      {periodLength.map((length) => (
                        <MenuItem value={length} key={length}>
                          {`${length} ${
                            values.period === "Weekly"
                              ? length === "1"
                                ? "Week"
                                : "Weeks"
                              : length === "1"
                              ? "Month"
                              : "Months"
                          }`}
                        </MenuItem>
                      ))}
                    </Select>
                    {touched.period && errors.period && (
                      <Typography variant="caption" color="error">
                        {errors.period}
                      </Typography>
                    )}
                  </FormControl>
                </Box>
                <Box sx={{ gridColumn: "span 2" }}>
                  {/* Start date field */}
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
                      minDate={dayjs(new Date())}
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
                  ADD BUDGET
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

export default AddBudget;

/**/
/*
NAME

        calculateEndDate - a function that calculates the end date of a budget. 

SYNOPSIS

        calculateEndDate(startDate, period, noOfPeriod);
          startDate    --> the start date of the budget.
          period       --> the period of the budget (Weekly or Monthly).
          noOfPeriod   --> the number of periods for the budget.

DESCRIPTION

        This function calculates the end date of a budget based on the given start date,
        period, and number of periods. It calculates the end date by adding the number of
        periods to the start date. The end date is returned as a Date object.

RETURNS

        Returns the end date of the budget as a Date object.

*/
const calculateEndDate = (startDate, period, noOfPeriod) => {
  let endDate;
  const daysInWeek = 7;
  const daysInMonth = 30;

  // Calculate the end date based on the given start date, period, and number of periods.
  switch (period) {
    case "Weekly":
      // Calculate the end date for a weekly period.
      endDate = addDays(new Date(startDate), noOfPeriod * daysInWeek - 1);
      break;
    case "Monthly":
      // Calculate the end date for a monthly period.
      endDate = addDays(new Date(startDate), noOfPeriod * daysInMonth - 1);
      break;
    default:
      // Set the end date to the start date if the period is invalid.
      endDate = new Date(startDate);
  }

  return endDate;
};
