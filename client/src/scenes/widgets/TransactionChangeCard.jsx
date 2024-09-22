import WidgetWrapper from "../../components/WidgetWrapper";
import FlexBetween from "../../components/FlexBetween";
import { Typography, Box, useTheme } from "@mui/material";
import ArrowDropUpSharpIcon from "@mui/icons-material/ArrowDropUpSharp";
import ArrowDropDownSharpIcon from "@mui/icons-material/ArrowDropDownSharp";

/**/
/*
NAME

        TransactionChangeCard - A react functional component that displays the change in income or expense transactions between the current month and the previous month.

SYNOPSIS

        TransactionChangeCard({ transaction, type })
                transaction --> An array of transaction objects.
                type --> The type of transactions (income or expense).

DESCRIPTION

        The TransactionChangeCard component displays the change in income or expense transactions between the current month and the previous month.
        The component takes in an array of transaction objects and the type of transactions (income or expense) as props.
        The component calculates the total income or expense for the current month and the previous month and displays the change in amount.

RETURNS

        Returns the JSX elements to display the change in income or expense transactions between the current month and the previous month.

*/
/**/

const TransactionChangeCard = ({ transaction, type }) => {
  // Colors for income and expense transactions
  // Green for income increase, red for income decrease
  // Red for expense increase, green for expense decrease
  const incomeUpColor = "#4CAF50";
  const incomeDownColor = "#FF474C";
  const expenseUpColor = "#FF474C";
  const expenseDownColor = "#4CAF50";

  // get the theme colors
  const { palette } = useTheme();

  // calculate the transaction change
  const { amountChange, isIncrease, isEqual } =
    calculateTransactionChange(transaction);

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
        {isEqual
          ? `No Change in ${
              type === "income" ? "Income" : "Expense"
            } this month`
          : `${isIncrease ? "Increase" : "Decrease"} in ${
              type === "income" ? "Income" : "Expense"
            } this month`}
      </Typography>
      {!isEqual && (
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
            {isIncrease ? (
              <ArrowDropUpSharpIcon
                sx={{
                  color: type === "income" ? incomeUpColor : expenseUpColor,
                  height: "2.5rem",
                  width: "2.5rem",
                }}
              />
            ) : (
              <ArrowDropDownSharpIcon
                sx={{
                  color: type === "income" ? incomeDownColor : expenseDownColor,
                  height: "2.5rem",
                  width: "2.5rem",
                }}
              />
            )}
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontSize: "2rem",
                  fontWeight: "900",
                  color: isIncrease
                    ? type === "income"
                      ? incomeUpColor
                      : expenseUpColor
                    : type === "income"
                    ? incomeDownColor
                    : expenseDownColor,
                }}
              >
                {`$${Math.abs(amountChange)}`}
              </Typography>
            </Box>
          </FlexBetween>
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default TransactionChangeCard;

/**/
/*

NAME

        calculateTransactionChange - A function that calculates the change in income or expense transactions between the current month and the previous month.

SYNOPSIS

        calculateTransactionChange(transactions)
                transactions --> An array of transaction objects.

DESCRIPTION

        The calculateTransactionChange function calculates the change in income or expense transactions between the current month and the previous month.
        The function takes in an array of transaction objects as an argument. It filters the transactions by the current and previous month. 
        It then calculates the total income or expense for the current and previous month. The function calculates the amount change between 
        the current and previous month and returns whether the amount has increased, decreased, or remained the same.

RETURNS

        Returns an object containing the amount change, whether the amount has increased, decreased, or remained the same.

*/
/**/

const calculateTransactionChange = (transactions) => {
  // current month
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // previous month
  const previousMonthDate = new Date(currentYear, currentMonth - 1, 1);

  // filter transactions by current and previous month
  const currentMonthTransaction = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    return (
      transactionDate.getMonth() === currentMonth &&
      transactionDate.getFullYear() === currentYear
    );
  });

  const previousMonthTransaction = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    return (
      transactionDate.getMonth() === previousMonthDate.getMonth() &&
      transactionDate.getFullYear() === previousMonthDate.getFullYear()
    );
  });

  // calculate totals
  const currentTotal = currentMonthTransaction.reduce(
    (acc, transaction) => acc + transaction.amount,
    0
  );

  const previousTotal = previousMonthTransaction.reduce(
    (acc, transaction) => acc + transaction.amount,
    0
  );

  // calculate amount change
  const amountChange = currentTotal - previousTotal;
  const isEqual = amountChange === 0;
  const isIncrease = amountChange > 0;

  return { amountChange: amountChange.toFixed(2), isIncrease, isEqual };
};
