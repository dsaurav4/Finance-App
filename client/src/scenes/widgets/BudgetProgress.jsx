import { Alert, Box, Divider, Typography, useMediaQuery } from "@mui/material";
import WidgetWrapper from "../../components/WidgetWrapper";
import FlexBetween from "../../components/FlexBetween";
import BudgetChart from "./BudgetChart";
import { useSelector } from "react-redux";
import {
  differenceInDays,
  differenceInWeeks,
  differenceInMonths,
  parseISO,
  isWithinInterval,
} from "date-fns";

const BudgetProgress = ({ budget, showChart, active }) => {
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const expenses = useSelector((state) => state.expenses);

  const totalBudget = budget ? calculateTotalBudget(budget) : 0;
  const totalExpenses = budget
    ? calculateTotalExpensesToDate(budget, expenses)
    : 0;

  const expenditurePercentage =
    budget && ((totalExpenses / totalBudget) * 100).toFixed(2);

  const averageDailyExpense = (
    totalExpenses /
    (daysSinceStartDate(budget.startDate) + 1)
  ).toFixed(2);

  const expectedDailyAverage = (
    totalBudget / daysInBudgetPlan(budget.startDate, budget.endDate)
  ).toFixed(2);

  const averageDailyPercent = (
    (averageDailyExpense / expectedDailyAverage) *
    100
  ).toFixed(2);

  const projectedExpense = (
    averageDailyExpense * daysInBudgetPlan(budget.startDate, budget.endDate)
  ).toFixed(2);

  const projectedExpensePercent = (
    (projectedExpense / totalBudget) *
    100
  ).toFixed(2);

  const budgetColor = projectedExpensePercent < 100 ? "green" : "red";

  return (
    <WidgetWrapper sx={{ p: "3rem" }}>
      {budget ? (
        <>
          <FlexBetween
            flexDirection={`${isNonMobileScreens ? "row" : "column"}`}
            sx={{ marginY: "2rem" }}
            gap="1rem"
          >
            <FlexBetween flexDirection="column" alignItems="flex-start">
              <Typography
                sx={{
                  width: "100%",
                  textAlign: "left",
                  marginBottom: "0.5rem",
                }}
              >
                Total Spend In this Period
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  width: "100%",
                  textAlign: "left",
                  marginBottom: "0.5rem",
                  fontWeight: "bolder",
                }}
              >
                <span
                  style={{ color: budgetColor }}
                >{`$${totalExpenses}`}</span>{" "}
                / {`$${totalBudget}`}
              </Typography>
              <Typography sx={{ width: "100%", textAlign: "left" }}>
                <span
                  style={{ color: budgetColor }}
                >{`${expenditurePercentage}%`}</span>{" "}
                of the budget
              </Typography>
            </FlexBetween>
            <Divider
              orientation={`${isNonMobileScreens ? "vertical" : "horizontal"}`}
              flexItem
            />
            <FlexBetween flexDirection="column" alignItems="flex-start">
              <Typography
                sx={{
                  width: "100%",
                  textAlign: "left",
                  marginBottom: "0.5rem",
                }}
              >
                Projected Spend
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  width: "100%",
                  textAlign: "left",
                  marginBottom: "0.5rem",
                  fontWeight: "bolder",
                }}
              >
                {`$${projectedExpense}`}
              </Typography>
              <Typography sx={{ width: "100%", textAlign: "left" }}>
                <span
                  style={{ color: budgetColor }}
                >{`${projectedExpensePercent}%`}</span>{" "}
                of the budget
              </Typography>
            </FlexBetween>
            <Divider
              orientation={`${isNonMobileScreens ? "vertical" : "horizontal"}`}
              flexItem
            />
            <FlexBetween flexDirection="column" alignItems="flex-start">
              <Typography
                sx={{
                  width: "100%",
                  textAlign: "left",
                  marginBottom: "0.5rem",
                }}
              >
                Average Daily Spend
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  width: "100%",
                  textAlign: "left",
                  marginBottom: "0.5rem",
                  fontWeight: "bolder",
                }}
              >
                {`$${averageDailyExpense}/day`}
              </Typography>
              <Typography sx={{ width: "100%", textAlign: "left" }}>
                <span
                  style={{ color: budgetColor }}
                >{`${averageDailyPercent}%`}</span>{" "}
                of the average daily budget
              </Typography>
            </FlexBetween>
            <Divider
              orientation={`${isNonMobileScreens ? "vertical" : "horizontal"}`}
              flexItem
            />
            <FlexBetween flexDirection="column" alignItems="flex-start">
              <Typography
                sx={{
                  width: "100%",
                  textAlign: "left",
                  marginBottom: "0.5rem",
                }}
              >
                Suggested Action
              </Typography>
              <Typography
                variant={projectedExpensePercent > 100 ? `h5` : `h4`}
                sx={{
                  width: "100%",
                  textAlign: "left",
                  marginBottom: "0.5rem",
                  fontWeight: "bolder",
                }}
              >
                {projectedExpensePercent < 100
                  ? "Keep it Up!"
                  : "Lower your Expenses!"}
              </Typography>
              <Typography sx={{ width: "100%", textAlign: "left" }}>
                {projectedExpensePercent < 100
                  ? "You are well under budget!"
                  : "You are going over your budget!"}
              </Typography>
            </FlexBetween>
          </FlexBetween>
          {showChart && <BudgetChart budget={budget} />}
        </>
      ) : (
        <Typography sx={{ textAlign: "center" }}>
          No Active Budget Plans for this Period
        </Typography>
      )}
    </WidgetWrapper>
  );
};

export default BudgetProgress;

const calculateTotalBudget = (budget) => {
  const { startDate, endDate, amount, period } = budget;
  const start = parseISO(startDate);
  const end = parseISO(endDate);

  let totalBudget = 0;

  if (period === "Weekly") {
    const weeks = differenceInWeeks(end, start) + 1;
    totalBudget = weeks * amount;
  } else if (period === "Monthly") {
    const months = differenceInMonths(end, start) + 1;
    totalBudget = months * amount;
  }

  return totalBudget;
};

const calculateTotalExpensesToDate = (budget, expenses) => {
  const today = new Date();
  const { startDate } = budget;
  const start = parseISO(startDate);

  const totalExpenses = expenses
    .filter((expense) =>
      isWithinInterval(parseISO(expense.date), { start, end: today })
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

  const diffInDays = differenceInDays(today, start);

  return diffInDays;
};

const daysInBudgetPlan = (startDate, endDate) => {
  const start = parseISO(startDate);
  const end = parseISO(endDate);

  const diffInDays = differenceInDays(end, start) + 1;

  return diffInDays;
};
