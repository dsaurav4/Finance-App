import Navbar from "../navbar";
import {
  Box,
  Typography,
  useMediaQuery,
  useTheme,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import AddBudget from "../widgets/AddBudget";
import { setBudgets } from "../../state/index.js";
import BudgetProgress from "../widgets/BudgetProgress.jsx";
import { parseISO, isWithinInterval } from "date-fns";
import WidgetWrapper from "../../components/WidgetWrapper.jsx";
import FlexBetween from "../../components/FlexBetween.jsx";
import {
  calculateTotalBudget,
  calculateTotalExpenses,
} from "../widgets/BudgetProgress.jsx";
import { Gauge, gaugeClasses } from "@mui/x-charts";
import { useNavigate } from "react-router-dom";

const Budget = () => {
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const userId = useSelector((state) => state.user._id);
  const token = useSelector((state) => state.token);
  const dispatch = useDispatch();
  const [period, setPeriod] = useState("Weekly");

  const periods = ["Weekly", "Monthly"];
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { palette } = useTheme();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePeriodSelect = (period) => {
    setPeriod(period);
    handleClose();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    getBudgets(userId, token, dispatch, setBudgets);
  }, []);

  const budgets = useSelector((state) => state.budgets);

  const weeklyBudgets = budgets.filter((budget) => budget.period === "Weekly");
  const monthlyBudgets = budgets.filter(
    (budget) => budget.period === "Monthly"
  );

  return (
    <Box sx={{ paddingBottom: "3rem" }}>
      <Navbar />
      <Box
        width={`${isNonMobileScreens ? "75%" : "100%"}`}
        padding={`0 6%`}
        display={isNonMobileScreens ? "flex" : "block"}
        flexDirection="column"
        gap="2rem"
        justifyContent="space-between"
        sx={{
          marginTop: "1rem",
          marginX: `${isNonMobileScreens ? "12.5%" : undefined}`,
        }}
      >
        <AddBudget />
        <Box
          gap="0.5rem"
          sx={{ display: "flex", gap: "1rem", marginTop: "1rem" }}
        >
          <Typography sx={{ display: "flex", alignItems: "center" }}>
            SELECT PERIOD
          </Typography>
          <Box>
            <Button
              id="period-button"
              aria-controls={open ? "period-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
              sx={{
                border: `2px solid ${palette.neutral.dark}`,
                borderRadius: "8px",
                padding: "8px 16px",
                color: "inherit",
                width: "5rem",
              }}
            >
              {period}
            </Button>
            <Menu
              id="period-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "period-button",
              }}
            >
              {periods.map((period) => (
                <MenuItem
                  key={period}
                  onClick={() => handlePeriodSelect(period)}
                >
                  {period}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: "2rem",
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: "bolder",
              textAlign: "center",
              width: "100%",
              marginTop: "2rem",
            }}
          >
            ACTIVE BUDGET PLANS
          </Typography>
          {period === "Weekly" ? (
            <BudgetProgress
              budget={getActiveBudget(weeklyBudgets)}
              showChart={true}
              active={true}
            />
          ) : (
            <BudgetProgress
              budget={getActiveBudget(monthlyBudgets)}
              showChart={true}
              active={true}
            />
          )}
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: "2rem",
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: "bolder",
              textAlign: "center",
              width: "100%",
              marginTop: "2rem",
            }}
          >
            EXPIRED BUDGET PLANS
          </Typography>
          {period === "Weekly" &&
          getExpiredBudgets(weeklyBudgets).length > 0 ? (
            getExpiredBudgets(weeklyBudgets).map((budget) => (
              <BudgetProgress
                key={budget._id}
                budget={budget}
                showChart={true}
                expired={true}
              />
            ))
          ) : period === "Monthly" &&
            getExpiredBudgets(monthlyBudgets).length > 0 ? (
            getExpiredBudgets(monthlyBudgets).map((budget) => (
              <BudgetProgress
                key={budget._id}
                budget={budget}
                showChart={true}
                expired={true}
              />
            ))
          ) : (
            <WidgetWrapper sx={{ p: "3rem" }}>
              <Typography sx={{ textAlign: "center" }}>
                No Expired Budgets
              </Typography>
            </WidgetWrapper>
          )}
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: "2rem",
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: "bolder",
              textAlign: "center",
              width: "100%",
              marginTop: "2rem",
            }}
          >
            UPCOMING BUDGET PLANS
          </Typography>
          {period === "Weekly" && getFutureBudgets(weeklyBudgets).length > 0 ? (
            getFutureBudgets(weeklyBudgets).map((budget) => (
              <BudgetProgress
                key={budget._id}
                budget={budget}
                showChart={false}
                upcoming={true}
              />
            ))
          ) : period === "Monthly" &&
            getFutureBudgets(monthlyBudgets).length > 0 ? (
            getFutureBudgets(monthlyBudgets).map((budget) => (
              <BudgetProgress
                key={budget._id}
                budget={budget}
                showChart={false}
                upcoming={true}
              />
            ))
          ) : (
            <WidgetWrapper sx={{ p: "3rem" }}>
              <Typography sx={{ textAlign: "center" }}>
                No Upcoming Budgets
              </Typography>
            </WidgetWrapper>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Budget;

export const getBudgets = async (userId, token, dispatch, setBudgets) => {
  try {
    const response = await fetch(
      `http://localhost:3001/budgets/${userId}/budgets`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      console.log("Error Occured!");
      return;
    }

    const data = await response.json();
    dispatch(setBudgets({ budgets: data }));
  } catch (error) {
    console.log("An error occured!");
    return;
  }
};

export const DashboardBudget = () => {
  const budgets = useSelector((state) => state.budgets);
  const expenses = useSelector((state) => state.expenses);

  const weeklyBudgets = budgets.filter((budget) => budget.period === "Weekly");
  const monthlyBudgets = budgets.filter(
    (budget) => budget.period === "Monthly"
  );

  const navigate = useNavigate();
  const { palette } = useTheme();
  const periods = ["Weekly", "Monthly"];
  const [period, setPeriod] = useState("Weekly");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePeriodSelect = (period) => {
    setPeriod(period);
    handleClose();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const budget = getActiveBudget(
    period === "Monthly" ? monthlyBudgets : weeklyBudgets
  );

  const totalBudget = budget ? calculateTotalBudget(budget) : 0;

  const totalExpenses = budget
    ? calculateTotalExpenses(budget, expenses, true, false)
    : 0;

  return (
    <WidgetWrapper width="100%">
      <Button
        id="period-button"
        aria-controls={open ? "period-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{
          border: `2px solid ${palette.neutral.dark}`,
          borderRadius: "8px",
          padding: "8px 16px",
          color: "inherit",
        }}
      >
        {period}
      </Button>
      <Menu
        id="period-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "period-button",
        }}
      >
        {periods.map((period) => (
          <MenuItem key={period} onClick={() => handlePeriodSelect(period)}>
            {period}
          </MenuItem>
        ))}
      </Menu>
      <FlexBetween sx={{ flexDirection: "column", width: "100%" }}>
        <Typography
          sx={{ fontWeight: "bolder", marginBottom: "1rem" }}
          variant="h6"
        >
          Active {period} Budget Plan
        </Typography>
        {budget ? (
          <Gauge
            width={200}
            height={200}
            value={totalExpenses}
            valueMax={totalBudget}
            text={({ value, valueMax }) => `$${value} / $${valueMax}`}
            sx={{
              [`& .${gaugeClasses.valueText}`]: {
                fontSize: 13,
                transform: "translate(0px, 0px)",
              },
              [`& .${gaugeClasses.valueArc}`]: {
                fill: totalExpenses > totalBudget ? "red" : "#52b202",
              },
              cursor: "pointer",
            }}
            onClick={() => navigate("/budget")}
          ></Gauge>
        ) : (
          <Typography>No Active {period} Plan.</Typography>
        )}
      </FlexBetween>
    </WidgetWrapper>
  );
};

const getActiveBudget = (budgets) => {
  const today = new Date();

  return budgets.find((budget) =>
    isWithinInterval(today, {
      start: parseISO(budget.startDate),
      end: parseISO(budget.endDate),
    })
  );
};

const getExpiredBudgets = (budgets) => {
  const today = new Date();

  return budgets.filter((budget) => parseISO(budget.endDate) < today);
};

const getFutureBudgets = (budgets) => {
  const today = new Date();

  return budgets.filter((budget) => parseISO(budget.startDate) > today);
};
