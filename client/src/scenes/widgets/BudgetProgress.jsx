import {
  Alert,
  Box,
  Divider,
  IconButton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import WidgetWrapper from "../../components/WidgetWrapper";
import FlexBetween from "../../components/FlexBetween";
import BudgetChart from "./BudgetChart";
import { useSelector, useDispatch } from "react-redux";
import {
  differenceInDays,
  differenceInWeeks,
  differenceInMonths,
  parseISO,
  isWithinInterval,
} from "date-fns";
import DeleteDialogBox from "../../components/DeleteDialogBox.jsx";
import { Delete } from "@mui/icons-material";
import { useState } from "react";
import { setBudgets } from "../../state";
import Alerts from "../../components/Alerts.jsx";

const BudgetProgress = ({ budget, showChart, active, expired, upcoming }) => {
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const dispatch = useDispatch();
  const expenses = useSelector((state) => state.expenses);
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

  const totalBudget = budget ? calculateTotalBudget(budget) : 0;

  const totalExpenses = budget
    ? calculateTotalExpenses(budget, expenses, active, expired)
    : 0;

  const expenditurePercentage =
    budget && ((totalExpenses / totalBudget) * 100).toFixed(2);

  const averageDailyExpense = budget
    ? (
        totalExpenses /
        (active
          ? daysSinceStartDate(budget.startDate)
          : daysInBudgetPlan(budget.startDate, budget.endDate))
      ).toFixed(2)
    : undefined;

  const expectedDailyAverage = budget
    ? (
        totalBudget / daysInBudgetPlan(budget.startDate, budget.endDate)
      ).toFixed(2)
    : undefined;

  const averageDailyPercent = (
    (averageDailyExpense / expectedDailyAverage) *
    100
  ).toFixed(2);

  const projectedExpense = budget
    ? (
        averageDailyExpense * daysInBudgetPlan(budget.startDate, budget.endDate)
      ).toFixed(2)
    : undefined;

  const projectedExpensePercent = (
    (projectedExpense / totalBudget) *
    100
  ).toFixed(2);

  const budgetColor = projectedExpensePercent < 100 ? "green" : "red";

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/budgets/${userId}/${budget._id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();

      dispatch(setBudgets({ budgets: data }));
      setAlert("Budget Plan deleted successfully.");
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
    <WidgetWrapper sx={{ p: "3rem" }}>
      {budget ? (
        <>
          <FlexBetween sx={{ justifyContent: "space-between" }}>
            <Typography variant="h3">
              {`Budget Period: ${new Date(budget.startDate).toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )} - ${new Date(budget.endDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}`}{" "}
            </Typography>
            <IconButton onClick={handleClickOpenDelete}>
              <Delete />
            </IconButton>
          </FlexBetween>
          <Typography variant="h5">{`${budget.period} Budget: ${budget.amount}`}</Typography>
          <FlexBetween
            flexDirection={`${isNonMobileScreens ? "row" : "column"}`}
            sx={{ marginY: "2rem" }}
            gap="1rem"
          >
            <FlexBetween flexDirection="column" alignItems="flex-start">
              <Typography
                sx={{
                  width: "100%",
                  textAlign: "center",
                  marginBottom: "0.5rem",
                }}
              >
                Total Spend
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  width: "100%",
                  textAlign: "center",
                  marginBottom: "0.5rem",
                  fontWeight: "bolder",
                }}
              >
                <span
                  style={{ color: budgetColor }}
                >{`$${totalExpenses}`}</span>{" "}
                / {`$${totalBudget}`}
              </Typography>
              <Typography sx={{ width: "100%", textAlign: "center" }}>
                <span style={{ color: budgetColor }}>{`${
                  expenditurePercentage <= 100
                    ? `${expenditurePercentage}%`
                    : `$${totalExpenses - totalBudget}`
                }`}</span>{" "}
                {`${expenditurePercentage <= 100 ? "of" : "over"}`} the total
                allocated budget
              </Typography>
            </FlexBetween>
            {active ? (
              <>
                <Divider
                  orientation={`${
                    isNonMobileScreens ? "vertical" : "horizontal"
                  }`}
                  flexItem
                />
                <FlexBetween flexDirection="column" alignItems="flex-start">
                  <Typography
                    sx={{
                      width: "100%",
                      textAlign: "center",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Projected Spend
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      width: "100%",
                      textAlign: "center",
                      marginBottom: "0.5rem",
                      fontWeight: "bolder",
                    }}
                  >
                    <span
                      style={{ color: budgetColor }}
                    >{`$${projectedExpense}`}</span>
                  </Typography>
                  <Typography sx={{ width: "100%", textAlign: "center" }}>
                    <span style={{ color: budgetColor }}>
                      {projectedExpensePercent <= 100
                        ? `${projectedExpensePercent}%`
                        : `$${(projectedExpense - totalBudget).toFixed(2)}`}
                    </span>{" "}
                    {projectedExpensePercent <= 100 ? "of" : "over"} the total
                    allocated budget
                  </Typography>
                </FlexBetween>
              </>
            ) : (
              <></>
            )}
            <Divider
              orientation={`${isNonMobileScreens ? "vertical" : "horizontal"}`}
              flexItem
            />
            <FlexBetween flexDirection="column" alignItems="flex-start">
              <Typography
                sx={{
                  width: "100%",
                  textAlign: "center",
                  marginBottom: "0.5rem",
                }}
              >
                Average Daily Spend
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  width: "100%",
                  textAlign: "center",
                  marginBottom: "0.5rem",
                  fontWeight: "bolder",
                }}
              >
                <span
                  style={{ color: budgetColor }}
                >{`$${averageDailyExpense}`}</span>
                /day
              </Typography>
              <Typography sx={{ width: "100%", textAlign: "center" }}>
                <span style={{ color: budgetColor }}>
                  {averageDailyPercent <= 100
                    ? `${averageDailyPercent}%`
                    : `$${(averageDailyExpense - expectedDailyAverage).toFixed(
                        2
                      )}`}
                </span>{" "}
                {averageDailyPercent <= 100 ? "of" : "over"} the expected
                average daily budget
              </Typography>
            </FlexBetween>
            <Divider
              orientation={`${isNonMobileScreens ? "vertical" : "horizontal"}`}
              flexItem
            />
            <FlexBetween flexDirection="column" alignItems="flex-start">
              {active || expired ? (
                <>
                  {" "}
                  <Typography
                    sx={{
                      width: "100%",
                      textAlign: "center",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {active ? "Suggested Action" : "Remarks"}
                  </Typography>
                  <Typography
                    variant={projectedExpensePercent > 100 ? `h5` : `h4`}
                    sx={{
                      width: "100%",
                      textAlign: "center",
                      marginBottom: "0.5rem",
                      fontWeight: "bolder",
                      color: budgetColor,
                    }}
                  >
                    {projectedExpensePercent < 100
                      ? active
                        ? "Keep it Up!"
                        : "You were under budget!"
                      : active
                      ? "Lower your Expenses!"
                      : "You went over budget!"}
                  </Typography>
                  <Typography sx={{ width: "100%", textAlign: "center" }}>
                    {active
                      ? projectedExpensePercent < 100
                        ? "You are well under budget!"
                        : "You are going over your budget!"
                      : ""}
                  </Typography>
                </>
              ) : (
                <>
                  <Typography
                    variant="h4"
                    sx={{
                      width: "100%",
                      textAlign: "center",
                      marginBottom: "0.5rem",
                      fontWeight: "bolder",
                    }}
                  >
                    - - - - -
                  </Typography>
                </>
              )}
            </FlexBetween>
          </FlexBetween>
          {showChart && <BudgetChart budget={budget} />}
        </>
      ) : (
        <Typography sx={{ textAlign: "center" }}>
          No Active Budget Plans for this Period
        </Typography>
      )}
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
    </WidgetWrapper>
  );
};

export default BudgetProgress;

const calculateTotalBudget = (budget) => {
  const { startDate, endDate, amount, period } = budget;
  const start = parseISO(startDate);
  const end = parseISO(endDate);

  const totalDays = differenceInDays(end, start) + 1;
  let totalBudget = 0;

  if (period === "Weekly") {
    const weeks = totalDays / 7;
    totalBudget = weeks * amount;
  } else if (period === "Monthly") {
    const months = totalDays / 30;
    totalBudget = months * amount;
  }

  return totalBudget;
};

const calculateTotalExpenses = (budget, expenses, active, expired) => {
  const today = new Date();
  const { startDate } = budget;
  const start = parseISO(startDate);

  const totalExpenses = expenses
    .filter((expense) =>
      isWithinInterval(parseISO(expense.date), {
        start,
        end: active ? today : budget.endDate,
      })
    )
    .reduce((sum, expense) => sum + expense.amount, 0);

  return totalExpenses;
};

const daysUntilDate = (targetDate) => {
  const today = new Date();
  const target = new Date(targetDate);

  const diffInMs = target - today;

  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

  return diffInDays;
};

const daysSinceStartDate = (startDate) => {
  const today = new Date();
  const start = parseISO(startDate);

  const diffInDays = differenceInDays(today, start) + 1;

  return diffInDays;
};

const daysInBudgetPlan = (startDate, endDate) => {
  const start = parseISO(startDate);
  const end = parseISO(endDate);

  const diffInDays = differenceInDays(end, start) + 1;

  return diffInDays;
};
