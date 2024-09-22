import {
  IconButton,
  Typography,
  useMediaQuery,
  Box,
  Button,
  TextField,
  useTheme,
  InputAdornment,
} from "@mui/material";
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";
import WidgetWrapper from "../../components/WidgetWrapper";
import FlexBetween from "../../components/FlexBetween";
import BudgetChart from "./BudgetChart";
import { useSelector, useDispatch } from "react-redux";
import { differenceInDays, parseISO, isWithinInterval } from "date-fns";
import DeleteDialogBox from "../../components/DeleteDialogBox.jsx";
import { Delete, Upcoming } from "@mui/icons-material";
import { useState } from "react";
import { setSavingGoal, setSavingGoals } from "../../state";
import Alerts from "../../components/Alerts.jsx";
import { Formik } from "formik";
import * as yup from "yup";

// validation schema for updating a saving goal
// - addedMoney: a number greater than 0
const updateSavingSchema = yup.object().shape({
  addedMoney: yup
    .number()
    .typeError("Amount must be a number")
    .required("Amount is required")
    .min(1, "Amount cannot be negative or zero"),
});

// initial values for the update saving goal form
// - addedMoney: empty string
const initialUpdateSavingSchema = {
  addedMoney: "",
};

/**/
/*
NAME

        SavingGoalProgress - A react functional component that displays the progress of a saving goal.

SYNOPSIS

        SavingGoalProgress({ goal, active, expired, upcoming })
                goal --> The saving goal object.
                active --> A flag to determine if the saving goal is active.
                expired --> A flag to determine if the saving goal is expired.
                upcoming --> A flag to determine if the saving goal is upcoming.

DESCRIPTION

        The SavingGoalProgress component displays the progress of a saving goal.
        The component takes in the saving goal object and flags to determine if the saving goal is active, expired, or upcoming.
        The component displays the saving goal name, start date, end date, target amount, and current amount.
        It also displays a gauge chart showing the progress of the saving goal.
        If the saving goal is active, the component allows the user to add money to the saving goal.
        If the saving goal is expired, the component displays the amount failed to save in red.
        If the saving goal is upcoming, the component displays the target amount.
        The component also allows the user to delete the saving goal.

RETURNS

        Returns the JSX elements to display the progress of a saving goal.

*/
/**/
const SavingGoalProgress = ({ goal, active, expired, upcoming }) => {
  // Determine whether the screen size is larger than 1000px
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  // Get the dispatch function from the Redux store
  const dispatch = useDispatch();
  // Get the theme palette
  const { palette } = useTheme();

  // a flag to determine whether the delete dialog box is open
  const [openDelete, setOpenDelete] = useState(false);
  // the user ID from the Redux store
  const userId = useSelector((state) => state.user._id);
  // the authentication token from the Redux store
  const token = useSelector((state) => state.token);

  // the alert message to be displayed
  const [alert, setAlert] = useState("");
  // the severity of the alert (error, warning, info, success)
  const [severity, setSeverity] = useState("error");
  // a flag to determine whether the alert is open
  const [alertOpen, setAlertOpen] = useState(false);

  /**/
  /*
  NAME

          handleAlertClose - A function that handles the closing of the alert message.

  SYNOPSIS

          handleAlertClose(event, reason)
                  event --> The event object.
                  reason --> The reason for closing the alert message.

  DESCRIPTION

          The handleAlertClose function handles the closing of the alert message.

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

  /**/
  /*
  NAME

          handleClickOpenDelete - A function that opens the delete dialog box.

  SYNOPSIS

          handleClickOpenDelete()

  DESCRIPTION

          The handleClickOpenDelete function opens the delete dialog box.

  RETURNS

          No return value.

  */
  /**/
  const handleClickOpenDelete = () => {
    setOpenDelete(true);
  };

  /**/
  /*
  NAME

          handleCloseDelete - A function that closes the delete dialog box.

  SYNOPSIS

          handleCloseDelete()

  DESCRIPTION

          The handleCloseDelete function closes the delete dialog box. 

  RETURNS

          No return value.

  */
  /**/
  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  /**/
  /*
  NAME

          handleFormSubmit - A function that handles the submission of the update saving goal form.

  SYNOPSIS

          handleFormSubmit(values, onSubmitProps)
                  values --> The values from the update saving goal form.
                  onSubmitProps --> The formik form submission props.

  DESCRIPTION

          The handleFormSubmit function handles the submission of the update saving goal form.

  RETURNS

          No return value.

  */
  /**/
  const handleFormSubmit = async (values, onSubmitProps) => {
    try {
      // create a new FormData object and append the added money value
      const formData = new FormData();
      formData.append("addedMoney", values.addedMoney);

      // send a PATCH request to the server to update the saving goal
      const response = await fetch(
        `http://localhost:3001/savingGoals/${userId}/${goal._id}`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      // if the response is not OK, display an error message
      if (!response.ok) {
        const errorResponse = await response.json();
        setAlert(errorResponse.message || "Failed to save budget.");
        setSeverity("error");
        setAlertOpen(true);
        return;
      }

      // if the response is OK, update the saving goal in the state and display a success message
      const savingGoal = await response.json();
      dispatch(setSavingGoal({ savingGoal }));
      onSubmitProps.resetForm();
      setAlert("Money Added successfully.");
      setSeverity("success");
      setAlertOpen(true);
    } catch (error) {
      // if an error occurs, display an error message
      setAlert("An error occurred. Please try again.");
      setSeverity("error");
      setAlertOpen(true);
    }
  };

  /**/
  /*

  NAME

          handleDelete - A function that handles the deletion of a saving goal.

  SYNOPSIS

          handleDelete()

  DESCRIPTION

          The handleDelete function handles the deletion of a saving goal. 
          It sends a DELETE request to the server to delete the saving goal.

  RETURNS

          No return value.

  */
  const handleDelete = async () => {
    try {
      // send a DELETE request to the server to delete the saving goal
      const response = await fetch(
        `http://localhost:3001/savingGoals/${userId}/${goal._id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // get the response data
      const data = await response.json();

      // update the state with the new list of saving goals
      dispatch(setSavingGoals({ savingGoals: data }));
      // display a success message
      setAlert("Saving Goal deleted successfully.");
      setSeverity("success");
      setAlertOpen(true);
      // close the delete dialog box
      handleCloseDelete();
    } catch (error) {
      // if an error occurs, display an error message
      setAlert(error.message);
      setSeverity("error");
      setAlertOpen(true);
      // close the delete dialog box
      handleCloseDelete();
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
        <FlexBetween sx={{ justifyContent: "flex-end" }}>
          <IconButton onClick={handleClickOpenDelete}>
            <Delete />
          </IconButton>
        </FlexBetween>
        <FlexBetween flexDirection={`${isNonMobileScreens ? "row" : "column"}`}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              gap: "1rem",
            }}
          >
            <Typography variant="h3" sx={{ fontWeight: "bolder" }}>
              {goal.goalName}
            </Typography>
            {upcoming && (
              <Typography>
                STARTS ON:{" "}
                <span style={{ fontStyle: "italic" }}>
                  {new Date(goal.startDate).toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </Typography>
            )}
            <Typography>
              DUE DATE:{" "}
              <span style={{ fontStyle: "italic" }}>
                {new Date(goal.endDate).toLocaleString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </Typography>
            <Typography>
              {goal.targetAmount - goal.currentAmount > 0 ? (
                <>
                  {active && "AMOUNT TO SAVE"}
                  {upcoming && "TARGET AMOUNT"}
                  {expired && "AMOUNT FAILED TO SAVE"}:
                  <span
                    style={{
                      fontStyle: "italic",
                      color: expired ? "red" : "gold",
                      fontWeight: "bolder",
                    }}
                  >
                    {" $"}
                    {goal.targetAmount - goal.currentAmount}
                  </span>
                </>
              ) : (
                <span style={{ fontWeight: "bolder", color: "green" }}>
                  COMPLETED
                </span>
              )}
            </Typography>
            {active && (
              <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialUpdateSavingSchema}
                validationSchema={updateSavingSchema}
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
                    <FlexBetween gap="1rem" marginY="2rem">
                      <TextField
                        label="Add Money"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.addedMoney}
                        name="addedMoney"
                        error={
                          Boolean(touched.addedMoney) &&
                          Boolean(errors.addedMoney)
                        }
                        helperText={touched.addedMoney && errors.addedMoney}
                        sx={{ gridColumn: "span 2" }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">$</InputAdornment>
                          ),
                        }}
                      />
                      <Button
                        type="submit"
                        sx={{
                          gridColumn: "span 4",
                          p: "1rem",
                          backgroundColor: palette.primary.main,
                          color: palette.background.alt,
                          "&:hover": { color: palette.neutral.light },
                        }}
                      >
                        Add Savings
                      </Button>
                    </FlexBetween>
                  </form>
                )}
              </Formik>
            )}
          </Box>
          <Box>
            <Gauge
              width={250}
              height={250}
              value={
                goal.currentAmount <= goal.targetAmount
                  ? goal.currentAmount
                  : goal.targetAmount
              }
              valueMax={goal.targetAmount}
              text={({ value, valueMax }) => `$${value} / $${valueMax}`}
              sx={{
                [`& .${gaugeClasses.valueText}`]: {
                  fontSize: 20,
                  transform: "translate(0px, 0px)",
                },
                [`& .${gaugeClasses.valueArc}`]: {
                  fill:
                    expired && goal.targetAmount - goal.currentAmount > 0
                      ? "red"
                      : "#52b202",
                },
                marginY: upcoming || expired ? "1rem" : undefined,
              }}
            />
          </Box>
        </FlexBetween>
      </WidgetWrapper>
      <DeleteDialogBox
        open={openDelete}
        handleClose={handleCloseDelete}
        handleDelete={handleDelete}
      />
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

export default SavingGoalProgress;
