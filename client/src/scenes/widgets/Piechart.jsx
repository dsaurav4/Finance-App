import { PieChart } from "@mui/x-charts/PieChart";
import { Typography } from "@mui/material";
import WidgetWrapper from "../../components/WidgetWrapper";
import FlexBetween from "../../components/FlexBetween";

/**/
/*
NAME

        Piechart - A react functional component that displays a pie chart showing the distribution of income or expense by categories.

SYNOPSIS

        Piechart({ transactions, type })
                transactions --> An array of transaction objects.
                type --> The type of transactions (income or expense).

DESCRIPTION

        The Piechart component displays a pie chart showing the distribution of income or expense by categories.
        The component takes in an array of transaction objects and the type of transactions (income or expense) as props.
        The component categorizes the transactions by type and calculates the total amount for each category.
        It then filters the transactions by the current month and year and assigns a color to each category based on the transaction type.
        The component uses the PieChart component from the @mui/x-charts library to display the pie chart.

RETURNS

        Returns the JSX elements to display the pie chart showing the distribution of income or expense by categories.

*/
/**/
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

/**/
/*
NAME

        getTransactionsByCategory - A function that categorizes transactions by type and calculates the total amount for each category.

SYNOPSIS

        getTransactionsByCategory(transactions, type)
                transactions --> An array of transaction objects.
                type --> The type of transactions (income or expense).

DESCRIPTION

        The getTransactionsByCategory function categorizes transactions by type and calculates the total amount for each category.
        The function takes in an array of transaction objects and the type of transactions (income or expense) as arguments.
        The function categorizes the transactions by type and calculates the total amount for each category.
        It then filters the transactions by the current month and year and assigns a color to each category based on the transaction type.
        The function returns an array of objects containing the id, value, label, and color for each category.

RETURNS

        Returns an array of objects containing the id, value, label, and color for each category.

*/
/**/

const getTransactionsByCategory = (transactions, type) => {
  // The categories for income transactions
  const incomeCategories = [
    "Salary",
    "Freelance",
    "Investments",
    "Gifts",
    "Business",
    "Other",
  ];

  // The categories for expense transactions
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

  // The categories for the current type of transactions
  const categories = type === "income" ? incomeCategories : expenseCategories;

  // Initialize an object to store the total amount for each category
  // The keys for this object are the categories, and the values are the total amounts
  const transactionsByCategory = categories.reduce((acc, category) => {
    // Initialize the total amount for each category to 0
    acc[category] = 0;
    return acc;
  }, {});

  // The current date
  const currentDate = new Date();
  // The current month (0-11)
  const currentMonth = currentDate.getMonth();
  // The current year (4 digits)
  const currentYear = currentDate.getFullYear();

  // Filter transactions to only include those from the current month and year
  const currentMonthTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    return (
      // Check if the month of the transaction date matches the current month
      transactionDate.getMonth() === currentMonth &&
      // Check if the year of the transaction date matches the current year
      transactionDate.getFullYear() === currentYear
    );
  });

  // Iterate through all transactions in the current month and year,
  // and add up the total amount for each category
  currentMonthTransactions.forEach((transaction) => {
    const { category, amount } = transaction;

    // Check if the category is one that we are tracking
    // If it is, add the amount of the transaction to the total amount for that category
    // If it is not, add the amount to the "Other" category
    if (transactionsByCategory.hasOwnProperty(category)) {
      transactionsByCategory[category] += amount;
    } else {
      transactionsByCategory["Other"] += amount;
    }
  });

  // An array of different shades of green that will be used to color the pie chart
  const greenShades = [
    "#006400",
    "#228B22",
    "#32CD32",
    "#66CDAA",
    "#8FBC8F",
    "#90EE90",
    "#98FB98",
  ];

  // An array of different shades of red that will be used to color the pie chart
  const redShades = [
    "#8B0000",
    "#B22222",
    "#DC143C",
    "#FF6347",
    "#FF4500",
    "#FF7F7F",
    "#FF9999",
  ];

  // An array of colors to be used to color the pie chart
  // If the type is "income", use different shades of green
  // If the type is "expense", use different shades of red
  const colors = type === "income" ? greenShades : redShades;

  // Maps over the transactionsByCategory object and returns an array of objects
  return Object.keys(transactionsByCategory).map((category, index) => ({
    id: index,
    value: transactionsByCategory[category],
    label: category,
    color: colors[index % colors.length],
  }));
};
