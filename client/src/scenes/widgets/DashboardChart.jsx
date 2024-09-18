import { LineChart } from "@mui/x-charts/LineChart";
import WidgetWrapper from "../../components/WidgetWrapper";
import { Button, Menu, MenuItem, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import FlexBetween from "../../components/FlexBetween";
import { useSelector } from "react-redux";
import {
  eachDayOfInterval,
  eachMonthOfInterval,
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfYear,
  endOfYear,
  parseISO,
} from "date-fns";
import { BarChart } from "@mui/x-charts";
import { axisClasses } from "@mui/x-charts/ChartsAxis";

const DashboardChart = ({ period, setPeriod }) => {
  const incomes = useSelector((state) => state.incomes);
  const expenses = useSelector((state) => state.expenses);
  const { palette } = useTheme();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const periods = ["Weekly", "Monthly", "Yearly"];

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

  const aggregatedData = aggregateTransactionsByPeriod(
    incomes,
    expenses,
    period
  );

  const valueFormatter = (value) => `$${value}`;
  return (
    <WidgetWrapper
      sx={{
        width: "100%",
      }}
    >
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
      <BarChart
        dataset={aggregatedData}
        xAxis={[
          {
            scaleType: "band",
            dataKey: "period",
            label: `${period === "Monthly" || period === "Weekly" ? "Days" : ""}
             ${period === "Yearly" ? "Months" : ""}`,
          },
        ]}
        series={[
          {
            dataKey: "income",
            label: "Incomes",
            color: "#4CAF50",
            valueFormatter,
          },
          {
            dataKey: "expense",
            label: "Expenses",
            color: "#FF474C",
            valueFormatter,
          },
        ]}
        margin={{ left: 100 }}
        {...chartSetting}
      />
      <FlexBetween
        sx={{ justifyContent: "center", width: "100%", padding: "1.5rem" }}
      >
        {aggregatedData.length > 0 &&
        aggregatedData.every(
          (periodData) => periodData.income === 0 && periodData.expense === 0
        ) ? (
          <Typography>No transactions recorded for this period.</Typography>
        ) : (
          <Typography variant="h6">Recent Transactions Summary</Typography>
        )}
      </FlexBetween>
    </WidgetWrapper>
  );
};

export default DashboardChart;

const aggregateTransactionsByPeriod = (incomes, expenses, period) => {
  const today = new Date();

  let interval;
  let formatPattern;

  if (period === "Monthly") {
    interval = eachDayOfInterval({
      start: startOfMonth(today),
      end: endOfMonth(today),
    });
    formatPattern = "dd MMM";
  } else if (period === "Weekly") {
    interval = eachDayOfInterval({
      start: startOfWeek(today),
      end: endOfWeek(today),
    });
    formatPattern = "dd MMM";
  } else if (period === "Yearly") {
    interval = eachMonthOfInterval({
      start: startOfYear(today),
      end: endOfYear(today),
    });
    formatPattern = "MMM yyyy";
  } else {
    throw new Error(
      "Invalid period. Please choose 'month', 'week', or 'year'."
    );
  }

  const initialData = interval.map((date) => ({
    date: format(date, formatPattern, { timeZone: "UTC" }),
    income: 0,
    expense: 0,
  }));

  incomes.forEach((income) => {
    const incomeDate = format(parseISO(income.date), formatPattern);
    const entry = initialData.find((entry) => entry.date === incomeDate);
    if (entry) {
      entry.income += income.amount;
    }
  });

  expenses.forEach((expense) => {
    const expenseDate = format(parseISO(expense.date), formatPattern);
    const entry = initialData.find((entry) => entry.date === expenseDate);
    if (entry) {
      entry.expense += expense.amount;
    }
  });

  const result = initialData.map((entry) => ({
    period: format(new Date(entry.date), formatPattern, {
      timeZone: "UTC",
    }),
    income: entry.income,
    expense: entry.expense,
  }));

  return result;
};

const chartSetting = {
  yAxis: [
    {
      label: "Amount($)",
    },
  ],
  height: 350,
  sx: {
    [`.${axisClasses.left} .${axisClasses.label}`]: {
      transform: "translate(-30px, 0)",
    },
  },
  borderRadius: 10,
};
