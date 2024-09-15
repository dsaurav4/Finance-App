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

const updateSavingSchema = yup.object().shape({
  addedMoney: yup
    .number()
    .typeError("Amount must be a number")
    .required("Amount is required")
    .min(1, "Amount cannot be negative or zero"),
});

const initialUpdateSavingSchema = {
  addedMoney: "",
};

const SavingGoalProgress = ({ goal, active, expired, upcoming }) => {
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const dispatch = useDispatch();
  const { palette } = useTheme();

  const [openDelete, setOpenDelete] = useState(false);
  const userId = useSelector((state) => state.user._id);
  const token = useSelector((state) => state.token);

  const [alert, setAlert] = useState("");
  const [severity, setSeverity] = useState("error");
  const [alertOpen, setAlertOpen] = useState(false);
  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertOpen(false);
  };

  const handleClickOpenDelete = () => {
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    try {
      const formData = new FormData();
      formData.append("addedMoney", values.addedMoney);

      const response = await fetch(
        `http://localhost:3001/savingGoals/${userId}/${goal._id}`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
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

      const savingGoal = await response.json();
      dispatch(setSavingGoal({ savingGoal }));
      onSubmitProps.resetForm();
      setAlert("Money Added successfully.");
      setSeverity("success");
      setAlertOpen(true);
    } catch (error) {
      setAlert("An error occurred. Please try again.");
      setSeverity("error");
      setAlertOpen(true);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/savingGoals/${userId}/${goal._id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();

      dispatch(setSavingGoals({ savingGoals: data }));
      setAlert("Saving Goal deleted successfully.");
      setSeverity("success");
      setAlertOpen(true);
      handleCloseDelete();
    } catch (error) {
      setAlert(error.message);
      setSeverity("error");
      setAlertOpen(true);
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
