import { BarChart } from "@mui/x-charts/BarChart";
import {
  differenceInDays,
  addWeeks,
  addMonths,
  format,
  parseISO,
} from "date-fns";
import { useTheme, Box } from "@mui/material";
import { useSelector } from "react-redux";
import { ChartsReferenceLine } from "@mui/x-charts";
import { axisClasses } from "@mui/x-charts/ChartsAxis";

const BudgetChart = ({ budget }) => {
  const theme = useTheme();
  const expenses = useSelector((state) => state.expenses);

  const data = getBudgetBreakdown(budget, expenses);

  return (
    <Box>
      <BarChart
        dataset={data}
        series={[
          {
            dataKey: "expense",
            color: "#4CAF50",
            label: "Expense",
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
          stroke="red"
          label={`${budget.period} Budget $${budget.amount}`}
          strokeDasharray="5 5"
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
    const numberOfWeeks = Math.ceil(totalDays / 7);
    const weeks = [];

    for (let i = 0; i < numberOfWeeks; i++) {
      const weekStart = addWeeks(start, i);
      const weekEnd =
        addWeeks(start, i + 1) < end ? addWeeks(start, i + 1) : end;
      const weekExpenses = getExpensesBetweenDates(
        weekStart,
        weekEnd,
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
    const totalMonths = Math.ceil(differenceInDays(end, start) / 30);
    const months = [];

    for (let i = 0; i < totalMonths; i++) {
      const monthStart = addMonths(start, i);
      const monthEnd =
        addMonths(start, i + 1) < end ? addMonths(start, i + 1) : end;
      const monthExpenses = getExpensesBetweenDates(
        monthStart,
        monthEnd,
        expenses
      );

      months.push({
        label: `Month ${i + 1}`, // Update label to "Month 1", "Month 2", etc.
        expense: monthExpenses,
        color: monthExpenses > amount ? "red" : "#4CAF50",
      });
    }

    return months;
  }

  return [];
};
