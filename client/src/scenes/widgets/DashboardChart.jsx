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

/**/
/*
NAME
        DashboardChart

SYNOPSIS
        DashboardChart({ period, setPeriod });
                period --> The period for which the transactions are to be displayed.
                setPeriod --> A function to set the period.

DESCRIPTION

        A functional component that displays a chart of the user's incomes and expenses for a specified period.
        The component includes a button to select the period (weekly, monthly, yearly) and a chart displaying the
        total income and expense amounts for each period.

RETURNS

        Returns the JSX elements to display the chart and the period selection button.

*/
/**/
const DashboardChart = ({ period, setPeriod }) => {
  // incomes and expenses are the arrays of income and expense objects
  const incomes = useSelector((state) => state.incomes);
  const expenses = useSelector((state) => state.expenses);

  // the current theme
  const { palette } = useTheme();

  // the anchor element for the menu
  const [anchorEl, setAnchorEl] = useState(null);

  // whether the menu is open
  const open = Boolean(anchorEl);

  // the different periods that can be selected
  const periods = ["Weekly", "Monthly", "Yearly"];

  /**/
  /*
  NAME

          handleClick - Handles the click event on the period button.

  SYNOPSIS

          handleClick(event);
                  event --> The click event on the period button.

  DESCRIPTION

          A function that handles the click event on the period button. It sets the anchor element to the
          current target of the event, which opens the menu. The function is called when the period button
          is clicked. It sets the anchor element to the current target of the event, which opens the menu.

  RETURNS

          No return value.

  */
  /**/
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  /**/
  /*
  NAME

          handlePeriodSelect - Handles the selection of a period.

  SYNOPSIS

          handlePeriodSelect(period);
                  period --> The selected period.

  DESCRIPTION

          A function that handles the selection of a period. It sets the period to the selected period and
          closes the menu. The function is called when a period is selected from the menu. It sets the period
          to the selected period and closes the menu. The function is called when a period is selected from the menu.

  RETURNS

          No return value.

  */
  /**/
  const handlePeriodSelect = (period) => {
    setPeriod(period);
    handleClose();
  };

  /**/
  /*
  NAME

          handleClose - Handles the closing of the menu.

  SYNOPSIS

          handleClose();

  DESCRIPTION

          A function that handles the closing of the menu. It sets the anchor element to null, which closes the menu.
          The function is called when the menu is closed. It sets the anchor element to null, which closes the menu.

  RETURNS

          No return value.

  */
  /**/
  const handleClose = () => {
    setAnchorEl(null);
  };

  // aggregatedData is an array of objects containing the date and total amount
  // for each period (day, week, month, year).
  // The total amount is the sum of the amounts of all transactions in the period.
  const aggregatedData = aggregateTransactionsByPeriod(
    incomes,
    expenses,
    period
  );

  /**/
  /*
  NAME

          valueFormatter - Formats the value as a currency string.

  SYNOPSIS

          valueFormatter(value);
                  value --> The value to format.

  DESCRIPTION

          A function that formats the value as a currency string. It adds a dollar sign ($) to the value
          and returns the formatted string. The function is used to format the income and expense amounts
          in the chart. It adds a dollar sign ($) to the value and returns the formatted string. The function
          is used to format the income and expense amounts in the chart. The function is used to format the income
          and expense amounts in the chart. The function is used to format the income and expense amounts in the chart. 

  RETURNS

          Returns the formatted value as a currency string.

  */
  /**/
  const valueFormatter = (value) => `$${value}`;

  return (
    <WidgetWrapper
      sx={{
        width: "100%",
      }}
    >
      {/* Button for selecting the period */}
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
      {/* Menu for selecting the period */}
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
      {/* Chart displaying the incomes and expenses for the selected period */}
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
      {/* Text displaying the recent transactions summary */}
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

/**/
/*
NAME
        aggregateTransactionsByPeriod

SYNOPSIS

        aggregateTransactionsByPeriod(incomes, expenses, period);
                incomes --> An array of income objects.
                expenses --> An array of expense objects.
                period --> The period for which to aggregate the transactions.

DESCRIPTION

        A function that aggregates the income and expense transactions by the specified period (day, week, month, year).
        It calculates the total income and expense amounts for each period and returns an array of objects containing
        the period, total income amount, and total expense amount. The function is used to generate the data for the
        chart displaying the user's incomes and expenses for the selected period. It calculates the total income and
        expense amounts for each period and returns an array of objects containing the period, total income amount, and 
        total expense amount. 

RETURNS

        Returns an array of objects containing the period, total income amount, and total expense amount for each period.

*/
/**/
const aggregateTransactionsByPeriod = (incomes, expenses, period) => {
  /*************  ✨ Codeium Command 🌟  *************/
  // today is the current date
  const today = new Date();

  // interval is an array of dates representing the period
  // (e.g. all days in the current month, all days in the current week, etc.)
  let interval;
  // formatPattern is a string representing how to format the date
  // (e.g. "dd MMM" for "01 Jan", "dd MMM yyyy" for "01 Jan 2022", etc.)
  let formatPattern;
  /******  fdd5b503-ff21-485d-9320-733e94d28a75  *******/

  // Depending on the period, we need to generate an array of dates
  // representing each day in the period.
  // We also need to determine the format pattern for formatting the date.
  if (period === "Monthly") {
    // For a monthly period, we want to generate an array of dates
    // for each day in the current month.
    interval = eachDayOfInterval({
      start: startOfMonth(today),
      end: endOfMonth(today),
    });
    // We want to format the date as "dd MMM", e.g. "01 Jan".
    formatPattern = "dd MMM";
  } else if (period === "Weekly") {
    // For a weekly period, we want to generate an array of dates
    // for each day in the current week.
    interval = eachDayOfInterval({
      start: startOfWeek(today),
      end: endOfWeek(today),
    });
    // We want to format the date as "dd MMM", e.g. "01 Jan".
    formatPattern = "dd MMM";
  } else if (period === "Yearly") {
    // For a yearly period, we want to generate an array of months
    // for each month in the current year.
    interval = eachMonthOfInterval({
      start: startOfYear(today),
      end: endOfYear(today),
    });
    // We want to format the date as "MMM yyyy", e.g. "Jan 2022".
    formatPattern = "MMM yyyy";
  } else {
    throw new Error(
      "Invalid period. Please choose 'month', 'week', or 'year'."
    );
  }

  // Generate an array of objects, each representing a day in the period.
  // Each object will have a date, an income amount, and an expense amount.
  const initialData = interval.map((date) => ({
    // The date is formatted according to the period.
    date: format(date, formatPattern, { timeZone: "UTC" }),
    // The income and expense amounts are initialized to zero.
    income: 0,
    expense: 0,
  }));

  // Iterate through the incomes array and for each income,
  // find the corresponding entry in the initialData array
  // and add the income amount to the income property.
  incomes.forEach((income) => {
    const incomeDate = format(parseISO(income.date), formatPattern);
    const entry = initialData.find((entry) => entry.date === incomeDate);
    if (entry) {
      entry.income += income.amount;
    }
  });

  // Iterate through the expenses array and for each expense,
  // find the corresponding entry in the initialData array
  // and add the expense amount to the expense property.
  expenses.forEach((expense) => {
    const expenseDate = format(parseISO(expense.date), formatPattern);
    const entry = initialData.find((entry) => entry.date === expenseDate);
    if (entry) {
      // Add the expense amount to the expense property.
      entry.expense += expense.amount;
    }
  });

  // Create a new array with the same shape as initialData, but
  // with the period property formatted according to the period.
  const result = initialData.map((entry) => ({
    // The period is formatted according to the period.
    period: format(new Date(entry.date), formatPattern, {
      timeZone: "UTC",
    }),
    // The income and expense amounts are copied from the entry.
    income: entry.income,
    expense: entry.expense,
  }));

  return result;
};

// Define the chart settings
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
