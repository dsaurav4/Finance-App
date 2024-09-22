import { BarChart } from "@mui/x-charts/BarChart";
import { addDays, differenceInDays, parseISO } from "date-fns";
import { useTheme, Box } from "@mui/material";
import { useSelector } from "react-redux";
import { ChartsReferenceLine } from "@mui/x-charts";
import { axisClasses } from "@mui/x-charts/ChartsAxis";

/**/
/*
NAME

        BudgetChart - renders a bar chart to display the breakdown of expenses within a budget.

SYNOPSIS

        BudgetChart({ budget });
            budget    --> an object containing the budget data, including period and amount.

DESCRIPTION

        This component renders a vertical bar chart that shows the breakdown of expenses
        for a given budget. The chart displays each expense category and its corresponding
        amount. The y-axis represents the expense amounts, formatted with a dollar sign,
        and the x-axis shows the labels for each expense category.

        The chart also includes a reference line indicating the total budget amount, 
        with a label displaying the budget period and the budgeted amount.

        The color of each bar in the chart corresponds to its category. The chart is styled
        using the current theme and has customizable layout options, including axis
        label positioning and border radius.

RETURNS

        Returns JSX elements that render the budget breakdown chart.
*/
/**/

const BudgetChart = ({ budget }) => {
  // get the current theme
  const theme = useTheme();

  // get all expenses from the store
  const expenses = useSelector((state) => state.expenses);

  // get the breakdown of expenses for the given budget
  const data = getBudgetBreakdown(budget, expenses);

  // define a value formatter to append a dollar sign to the y-axis labels
  const valueFormatter = (value) => `$${value}`;
  return (
    <Box>
      <BarChart
        // dataset prop: the data to be rendered by the chart
        dataset={data}
        // series prop: an array of series objects
        series={[
          {
            // dataKey prop: the key in the dataset object that contains the data for this series
            dataKey: "expense",
            // color prop: the color to be used for this series
            color: "#4CAF50",
            // valueFormatter prop: a function that formats the y-axis labels
            valueFormatter,
          },
        ]}
        // xAxis prop: an array of x-axis objects
        xAxis={[
          {
            // scaleType prop: the type of scale to be used for the x-axis
            scaleType: "band",
            // dataKey prop: the key in the dataset object that contains the data for the x-axis
            dataKey: "label",
            // colorMap prop: an object that maps the values in the dataset to colors
            colorMap: {
              type: "ordinal",
              values: data.map((item) => item.label),
              colors: data.map((item) => item.color),
            },
            // label prop: the label to be displayed for the x-axis
            label: `${budget.period} Budget Breakdown`,
          },
        ]}
        // yAxis prop: an array of y-axis objects
        yAxis={[{ dataKey: "expense", title: "Expenses", label: "Amount" }]}
        // height prop: the height of the chart
        height={300}
        // layout prop: the layout of the chart
        layout="vertical"
        // borderRadius prop: the border radius of the chart
        borderRadius={10}
        // sx prop: an object containing CSS styles for the chart
        sx={{
          [`.${axisClasses.left} .${axisClasses.label}`]: {
            // shift the y-axis labels to the left by 25 pixels
            transform: "translateX(-25px)",
          },
        }}
      >
        <ChartsReferenceLine
          // y prop: the y-coordinate of the reference line
          y={budget.amount}
          // label prop: the label to be displayed for the reference line
          label={`${budget.period} Budget $${budget.amount}`}
        />
      </BarChart>
    </Box>
  );
};

export default BudgetChart;

/**/
/*
NAME

        getBudgetBreakdown - retrieves the breakdown of expenses for a given budget.

SYNOPSIS

        getBudgetBreakdown(budget, expenses);
            budget    --> an object containing the budget data, including period and amount.
            expenses  --> an array of expense objects with date and amount properties.

DESCRIPTION

        This function calculates the breakdown of expenses for a given budget based on the
        budget period and amount. It takes the budget object and an array of expense objects
        as input and returns an array of objects representing the expenses for each period
        within the budget. Each object in the array contains the label for the period, the
        total expense amount for that period, and the color of the bar in the chart. The color
        of the bar is red if the expenses exceed the budget amount and green otherwise. The
        function supports weekly and monthly budget periods. For weekly budgets, the function
        calculates the total expenses for each week within the budget period. For monthly budgets,
        the function calculates the total expenses for each month within the budget period. The
        function uses date-fns functions to parse dates and calculate the difference between dates. 

RETURNS

        Returns an array of objects representing the breakdown of expenses for the given budget.
*/
/**/
const getBudgetBreakdown = (budget, expenses) => {
  // Retrieve the period, start date, end date, and amount from the budget object
  const { period, startDate, endDate, amount } = budget;

  // Parse the start and end dates from strings to Date objects
  const start = parseISO(startDate);
  const end = parseISO(endDate);

  /**/
  /*
  NAME

          getExpensesBetweenDates - retrieves the total expenses between two dates.

  SYNOPSIS

          getExpensesBetweenDates(start, end, expenses);
              start     --> the start date of the period.
              end       --> the end date of the period.

  DESCRIPTION

          This function calculates the total expenses between two dates. It takes the start and
          end dates of the period and an array of expense objects as input and returns the total
          amount of expenses within that period. The function filters the expenses based on the
          date range and then calculates the sum of the amounts of the filtered expenses. The
          function uses the parseISO function from date-fns to parse the date strings in the
          expense objects. 

  RETURNS

          Returns the total amount of expenses between the start and end dates.

  */
  /**/
  const getExpensesBetweenDates = (start, end, expenses) => {
    return expenses
      .filter((expense) => {
        const expenseDate = parseISO(expense.date);
        return expenseDate >= start && expenseDate <= end;
      })
      .reduce((total, expense) => total + expense.amount, 0);
  };

  if (period === "Weekly") {
    const totalDays = differenceInDays(end, start);
    const daysInWeek = 7;
    const numberOfWeeks = Math.ceil(totalDays / daysInWeek);
    const weeks = [];

    for (let i = 0; i < numberOfWeeks; i++) {
      const weekStart = addDays(start, i * daysInWeek);
      const weekEnd = addDays(weekStart, daysInWeek - 1); // Ensure inclusive of start
      const effectiveEnd = weekEnd > end ? end : weekEnd; // Avoid overshooting the final date

      const weekExpenses = getExpensesBetweenDates(
        weekStart,
        effectiveEnd,
        expenses
      );

      weeks.push({
        label: `Week ${i + 1}`,
        expense: weekExpenses,
        color: weekExpenses > amount ? "red" : "#4CAF50",
      });
    }

    return weeks;
  } else if (period === "Monthly") {
    // Calculate the total number of days between the start and end dates.
    const totalDays = differenceInDays(end, start);
    // Approximate number of days in a month
    const daysInMonth = 30;
    // Calculate the number of months in the range, approximating 30 days per month.
    const numberOfMonths = Math.ceil(totalDays / daysInMonth);
    // Store the results in this array.
    const months = [];

    for (let i = 0; i < numberOfMonths; i++) {
      // Calculate the start date of this month by adding `i * daysInMonth` days to the start date.
      const monthStart = addDays(start, i * daysInMonth);
      // Calculate the end date of this month by adding `daysInMonth - 1` days to the start date of this month.
      // This ensures that the month end date is inclusive of the start date.
      const monthEnd = addDays(monthStart, daysInMonth - 1);
      // Ensure that the month end date does not exceed the given end date of the budget period.
      // If the month end date exceeds the budget end date, use the budget end date instead.
      const effectiveEnd = monthEnd > end ? end : monthEnd;

      // Calculate the total expenses for this month by calling the getExpensesBetweenDates function,
      // passing in the start and end dates of this month, and the list of expenses.
      const monthExpenses = getExpensesBetweenDates(
        monthStart,
        effectiveEnd,
        expenses
      );

      // Store the total expenses for this month, the color of the bar
      // (red if the expenses exceed the budget amount, green if not),
      // and a label indicating which month it is.
      months.push({
        label: `Month ${i + 1}`,
        expense: monthExpenses,
        color: monthExpenses > amount ? "red" : "#4CAF50",
      });
    }

    return months;
  }

  return [];
};
