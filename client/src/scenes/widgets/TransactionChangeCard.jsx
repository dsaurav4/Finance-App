import WidgetWrapper from "../../components/WidgetWrapper";
import FlexBetween from "../../components/FlexBetween";
import { Typography, Box, useTheme } from "@mui/material";
import ArrowDropUpSharpIcon from "@mui/icons-material/ArrowDropUpSharp";
import ArrowDropDownSharpIcon from "@mui/icons-material/ArrowDropDownSharp";

const TransactionChangeCard = ({ transaction, type }) => {
  const incomeUpColor = "#4CAF50";
  const incomeDownColor = "#FF474C";
  const expenseUpColor = "#FF474C";
  const expenseDownColor = "#4CAF50";

  const { palette } = useTheme();

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

const calculateTransactionChange = (transactions) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const previousMonthDate = new Date(currentYear, currentMonth - 1, 1);

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

  const currentTotal = currentMonthTransaction.reduce(
    (acc, transaction) => acc + transaction.amount,
    0
  );

  const previousTotal = previousMonthTransaction.reduce(
    (acc, transaction) => acc + transaction.amount,
    0
  );

  const amountChange = currentTotal - previousTotal;
  const isEqual = amountChange === 0;
  const isIncrease = amountChange > 0;

  return { amountChange, isIncrease, isEqual };
};
