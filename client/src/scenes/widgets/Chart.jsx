import { BarChart } from "@mui/x-charts/BarChart";
import WidgetWrapper from "../../components/WidgetWrapper";
import { format, eachMonthOfInterval, parseISO } from "date-fns";
import { Button, Menu, MenuItem, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import FlexBetween from "../../components/FlexBetween";

/**/
/*
NAME

        Chart - renders a bar chart to display the total income or expense each month for a given year.

SYNOPSIS

        Chart({ transactions, transactionsType, year, setYear });
            transactions        --> an array of transaction objects.
            transactionsType    --> a string indicating the type of transactions to display (income or expense).
            year                --> the year for which to display the transactions.
            setYear             --> a function to update the selected year.

DESCRIPTION

        This component renders a vertical bar chart that shows the total income or expense for each month
        in a given year. The chart displays the total amount of income or expense for each month, with the
        x-axis representing the months and the y-axis representing the total amount. The chart is styled
        using the current theme and has customizable layout options, including axis label positioning and chart height. 
        The component also includes a dropdown button to select the year for which to display the transactions. 
        The user can select a year from the dropdown menu, and the chart will update to show the total income or expense 
        for each month in the selected year. The component uses the aggregateTransactionsByMonth function to aggregate 
        the transactions by month for the selected year and generate the data for the bar chart. The component also
        includes a valueFormatter function to format the y-axis labels with a dollar sign. The component displays a message
        if there are no transactions recorded for the selected year. 

RETURNS
        
        The Chart component returns a vertical bar chart that displays the total income or expense for each month in a given year. 

*/
/**/
const Chart = ({ transactions, transactionsType, year, setYear }) => {
  // aggregates the transactions by month into an array of objects with
  // the format {month: string, total: number}
  const dataset = aggregateTransactionsByMonth(transactions, year);

  // state variables for the year selection dropdown
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // theme variables
  const { palette } = useTheme();

  // the current year
  const currentYear = new Date().getFullYear();

  // an array of years that the user can select from
  const years = [];

  // the years array is created by looping from 2020 to the current year
  // and pushing each year to the array
  for (let year = 2020; year <= currentYear; year++) {
    years.push(year);
  }

  /**/
  /*
  NAME

          handleClick - handles the click event on the year selection dropdown button.

  SYNOPSIS

          handleClick(event);
              event    --> the click event on the year selection dropdown button.

  DESCRIPTION

          This function is called when the user clicks on the year selection dropdown button.
          It sets the anchor element to the current target of the event, which opens the dropdown menu.

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

          handleYearSelect - handles the selection of a year from the dropdown menu.

  SYNOPSIS

          handleYearSelect(year);
              year    --> the year selected by the user.

  DESCRIPTION

          This function is called when the user selects a year from the dropdown menu.
          It updates the selected year in the parent component by calling the setYear function
          with the selected year as the argument. It then closes the dropdown menu.

  RETURNS

          No return value.

  */
  /**/
  const handleYearSelect = (year) => {
    setYear(year);
    handleClose();
  };

  /**/
  /*
  NAME

          handleClose - handles the closing of the dropdown menu.

  SYNOPSIS

          handleClose();

  DESCRIPTION

          This function is called when the user closes the dropdown menu.
          It sets the anchor element to null, which closes the dropdown menu.

  RETURNS

          No return value.

  */
  /**/
  const handleClose = () => {
    setAnchorEl(null);
  };

  /**/
  /*
  NAME

          valueFormatter - formats the y-axis labels with a dollar sign.

  SYNOPSIS

          valueFormatter(value);
              value    --> the value to be formatted.

  DESCRIPTION

          This function takes a numerical value as an argument and returns a string
          with a dollar sign appended to the value. It is used to format the y-axis labels
          in the bar chart component.

  RETURNS

          Returns a string with a dollar sign appended to the input value.

  */
  const valueFormatter = (value) => `$${value}`;

  return (
    <WidgetWrapper>
      {/* The year selection dropdown button */}
      <Button
        id="year-button"
        aria-controls={open ? "year-menu" : undefined}
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
        {year}
      </Button>

      {/* The year selection dropdown menu */}
      <Menu
        id="year-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "year-button",
        }}
      >
        {years.map((year) => (
          <MenuItem key={year} onClick={() => handleYearSelect(year)}>
            {year}
          </MenuItem>
        ))}
      </Menu>

      {/* The bar chart */}
      <BarChart
        dataset={dataset}
        xAxis={[
          {
            scaleType: "band",
            dataKey: "month",
          },
        ]}
        yAxis={[{ scaleType: "linear", dataKey: "totalAmount" }]}
        series={[
          {
            dataKey: "totalAmount",
            label: `Total ${
              transactionsType === "income" ? "Income" : "Expense"
            }`,
            color: transactionsType === "income" ? "#4CAF50" : "#FF474C",
            valueFormatter,
          },
        ]}
        layout="vertical"
        height={300}
        borderRadius={10}
      />

      {/* The FlexBetween component that displays the total income or expense each month */}
      <FlexBetween
        sx={{ justifyContent: "center", width: "100%", padding: "1.5rem" }}
      >
        {dataset.length > 0 &&
        dataset.every((monthData) => monthData.totalAmount === 0) ? (
          <Typography>No transactions recorded for this year.</Typography>
        ) : (
          <Typography variant="h6">
            {`Total ${
              transactionsType === "income" ? "Income" : "Expense"
            } Each Month for ${year}`}
          </Typography>
        )}
      </FlexBetween>
    </WidgetWrapper>
  );
};

export default Chart;

/**/
/*
NAME

        aggregateTransactionsByMonth - aggregates transactions by month for a given year.

SYNOPSIS

        aggregateTransactionsByMonth(transactions, year);
            transactions    --> an array of transaction objects.
            year            --> the year for which to aggregate the transactions.

DESCRIPTION

        This function takes an array of transaction objects and a year as arguments
        and aggregates the transactions by month for the given year. It generates an array
        of objects with the format {month: string, totalAmount: number}, where month is the
        name of the month and totalAmount is the sum of all transactions for that month. The
        function filters out transactions from other years and returns an array of objects
        representing the total income or expense for each month in the given year. If there
        are no transactions for a particular month, the total amount is set to 0. 

RETURNS

        Returns an array of objects with the format {month: string, totalAmount: number}.

*/
/**/

const aggregateTransactionsByMonth = (transactions, year) => {
  // Create a start date for the given year (January 1st)
  // and an end date for the given year (December 31st)
  const startDate = new Date(Date.UTC(year, 0, 1));
  const endDate = new Date(Date.UTC(year, 11, 31));

  // Generate an array of strings containing the month and year
  // for each month in the given year
  const allMonths = eachMonthOfInterval({
    start: startDate,
    end: endDate,
  })
    .filter((date) => date.getUTCFullYear() === year) // Filter out any months from other years
    .map((date) => format(date, "MMM yyyy"));

  // Aggregate transactions by month for the given year
  const transactionsByMonth = transactions.reduce((acc, transaction) => {
    const transactionDate = parseISO(transaction.date);
    const transactionYear = transactionDate.getUTCFullYear();

    // If the transaction year matches the given year,
    // add the transaction amount to the total amount for that month
    if (transactionYear === year) {
      const month = format(transactionDate, "MMM yyyy", { timeZone: "UTC" });
      if (!acc[month]) {
        // Initialize the total amount for the month if it doesn't exist
        acc[month] = 0;
      }
      // Add the transaction amount to the total amount for the month
      acc[month] += transaction.amount;
    }

    return acc;
  }, {});

  // Create an array of objects with month and totalAmount properties
  // totalAmount is the sum of all transactions for the given month
  // or 0 if there are no transactions for the month
  return allMonths.map((month) => ({
    month,
    totalAmount: transactionsByMonth[month] || 0,
  }));
};
