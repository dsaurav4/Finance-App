import { BarChart } from "@mui/x-charts/BarChart";
import { addDays, differenceInDays, parseISO } from "date-fns";
import { useTheme, Box } from "@mui/material";
import { useSelector } from "react-redux";
import { ChartsReferenceLine } from "@mui/x-charts";
import { axisClasses } from "@mui/x-charts/ChartsAxis";

const BudgetChart = ({ budget }) => {
  const theme = useTheme();
  const expenses = useSelector((state) => state.expenses);

  const data = getBudgetBreakdown(budget, expenses);
  const valueFormatter = (value) => `$${value}`;
  return (
    <Box>
      <BarChart
        dataset={data}
        series={[
          {
            dataKey: "expense",
            color: "#4CAF50",
            valueFormatter,
          },
        ]}
        xAxis={[
          {
            scaleType: "band",
            dataKey: "label",
            colorMap: {
              type: "ordinal",
              values: data.map((item) => item.label),
              colors: data.map((item) => item.color),
            },
            label: `${budget.period} Budget Breakdown`,
          },
        ]}
        yAxis={[{ dataKey: "expense", title: "Expenses", label: "Amount" }]}
        height={300}
        layout="vertical"
        borderRadius={10}
        sx={{
          [`.${axisClasses.left} .${axisClasses.label}`]: {
            transform: "translateX(-25px)",
          },
        }}
      >
        <ChartsReferenceLine
          y={budget.amount}
          label={`${budget.period} Budget $${budget.amount}`}
        />
      </BarChart>
    </Box>
  );
};

export default BudgetChart;

const getBudgetBreakdown = (budget, expenses) => {
  const { period, startDate, endDate, amount } = budget;
  const start = parseISO(startDate);
  const end = parseISO(endDate);

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
    const totalDays = differenceInDays(end, start);
    const daysInMonth = 30; // Approximate number of days in a month
    const numberOfMonths = Math.ceil(totalDays / daysInMonth);
    const months = [];

    for (let i = 0; i < numberOfMonths; i++) {
      const monthStart = addDays(start, i * daysInMonth);
      const monthEnd = addDays(monthStart, daysInMonth - 1); // Ensure inclusive of start
      const effectiveEnd = monthEnd > end ? end : monthEnd; // Avoid overshooting the final date

      const monthExpenses = getExpensesBetweenDates(
        monthStart,
        effectiveEnd,
        expenses
      );

      months.push({
        label: `Month ${i + 1}`, // Month 1, Month 2, etc.
        expense: monthExpenses,
        color: monthExpenses > amount ? "red" : "#4CAF50",
      });
    }

    return months;
  }

  return [];
};
