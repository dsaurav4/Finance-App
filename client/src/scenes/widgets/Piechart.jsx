import { PieChart } from "@mui/x-charts/PieChart";
import { Typography } from "@mui/material";
import WidgetWrapper from "../../components/WidgetWrapper";
import FlexBetween from "../../components/FlexBetween";

const Piechart = ({ transactions, type }) => {
  return (
    <WidgetWrapper width="100%" height="100%">
      <FlexBetween flexDirection="column" gap="3rem">
        <Typography>{`Distribution of ${
          type === "income" ? "Income" : "Expense"
        } by categories`}</Typography>
        <PieChart
          series={[
            {
              data: getTransactionsByCategory(transactions, type),
              highlightScope: { fade: "global", highlight: "item" },
            },
          ]}
          width={550}
          height={330}
        />
      </FlexBetween>
    </WidgetWrapper>
  );
};

export default Piechart;

const getTransactionsByCategory = (transactions, type) => {
  const incomeCategories = [
    "Salary",
    "Freelance",
    "Investments",
    "Gifts",
    "Business",
    "Other",
  ];

  const expenseCategories = [
    "Rent",
    "Utilities",
    "Groceries",
    "Food",
    "Entertainment",
    "Travel",
    "Healthcare",
    "Education",
    "Other",
  ];

  const categories = type === "income" ? incomeCategories : expenseCategories;

  const transactionsByCategory = categories.reduce((acc, category) => {
    acc[category] = 0;
    return acc;
  }, {});

  transactions.forEach((transaction) => {
    const { category, amount } = transaction;
    if (transactionsByCategory.hasOwnProperty(category)) {
      transactionsByCategory[category] += amount;
    } else {
      transactionsByCategory["Other"] += amount;
    }
  });

  const greenShades = [
    "#006400",
    "#228B22",
    "#32CD32",
    "#66CDAA",
    "#8FBC8F",
    "#90EE90",
    "#98FB98",
  ];

  const redShades = [
    "#8B0000",
    "#B22222",
    "#DC143C",
    "#FF6347",
    "#FF4500",
    "#FF7F7F",
    "#FF9999",
  ];

  const colors = type === "income" ? greenShades : redShades;

  return Object.keys(transactionsByCategory).map((category, index) => ({
    id: index,
    value: transactionsByCategory[category],
    label: category,
    color: colors[index % colors.length],
  }));
};
