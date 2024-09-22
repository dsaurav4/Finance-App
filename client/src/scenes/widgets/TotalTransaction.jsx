import WidgetWrapper from "../../components/WidgetWrapper";
import FlexBetween from "../../components/FlexBetween";
import { Typography, Box, useTheme } from "@mui/material";
import ArrowDropUpSharpIcon from "@mui/icons-material/ArrowDropUpSharp";
import ArrowDropDownSharpIcon from "@mui/icons-material/ArrowDropDownSharp";

/**/
/*

NAME  

        TotalTransaction - A react functional component that displays the total income or expense for the current month.

SYNOPSIS

        TotalTransaction({ transaction, type })
                transaction --> An array of transaction objects.
                type --> The type of transactions (income or expense).

DESCRIPTION

        The TotalTransaction component displays the total income or expense for the current month.
        The component takes in an array of transaction objects and the type of transactions (income or expense) as props.
        The component calculates the total income or expense for the current month and displays it along with an arrow icon
        pointing up for income transactions and down for expense transactions. The color of the arrow icon is green for income
        transactions and red for expense transactions.

RETURNS

        Returns the JSX elements to display the total income or expense for the current month.

*/
/**/
const TotalTransaction = ({ transaction, type }) => {
  // Income color
  const incomeColor = "#4CAF50";
  // Expense color
  const expenseColor = "#FF474C";
  // Get the theme palette
  const { palette } = useTheme();
  return (
    <WidgetWrapper
      sx={{
        paddingTop: "2rem",
        paddingX: "1.5rem",
        borderRadius: "20px",
      }}
      width="100%"
    >
      <Typography
        variant="h6"
        sx={{
          fontSize: "1rem",
          color: palette.neutral.dark,
        }}
      >
        {`Total ${type === "income" ? "Income" : "Expense"} this month`}
      </Typography>
      <Box
        sx={{
          display: "flex",
          gap: "2rem",
          alignItems: "center",
          padding: "1rem",
        }}
      >
        <FlexBetween
          sx={{
            alignItems: "center",
            justifyContent: "flex-start",
            gap: "16px",
            padding: "1rem",
            borderRadius: "8px",
          }}
        >
          {type === "income" ? (
            <ArrowDropUpSharpIcon
              sx={{
                color: type === "income" ? incomeColor : expenseColor,
                height: "2.5rem",
                width: "2.5rem",
              }}
            />
          ) : (
            <ArrowDropDownSharpIcon
              sx={{
                color: type === "income" ? incomeColor : expenseColor,
                height: "2.5rem",
                width: "2.5rem",
              }}
            ></ArrowDropDownSharpIcon>
          )}
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontSize: "2rem",
                fontWeight: "900",
                color: type === "income" ? incomeColor : expenseColor,
              }}
            >
              {`$${findTotalForMonth(transaction)}`}
            </Typography>
          </Box>
        </FlexBetween>
      </Box>
    </WidgetWrapper>
  );
};

export default TotalTransaction;

/**/
/*

NAME

        findTotalForMonth - A function that calculates the total income or expense for the current month.

SYNOPSIS

        findTotalForMonth(transactions)
                transactions --> An array of transaction objects.

DESCRIPTION

        The findTotalForMonth function calculates the total income or expense for the current month.
        The function takes in an array of transaction objects as an argument.
        The function gets the current month and year and filters the transactions to only include those from the current month.
        It then iterates through the transactions for the current month and adds up the amounts.
        The function returns the total income or expense for the current month.

RETURNS

        Returns the total income or expense for the current month.

*/
/**/
const findTotalForMonth = (transactions) => {
  // get the current month and year
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // filter transactions to only include those from the current month
  const currentMonthTransaction = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    return (
      transactionDate.getMonth() === currentMonth &&
      transactionDate.getFullYear() === currentYear
    );
  });

  // if there are no transactions for the current month, return 0
  if (currentMonthTransaction.length === 0) return 0;

  let totalTransaction = 0;

  // iterate through the transactions for the current month and add up the amounts
  for (const transaction of currentMonthTransaction) {
    totalTransaction += transaction.amount;
  }

  return totalTransaction.toFixed(2);
};
