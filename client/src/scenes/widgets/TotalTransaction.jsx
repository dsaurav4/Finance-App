import WidgetWrapper from "../../components/WidgetWrapper";
import FlexBetween from "../../components/FlexBetween";
import { Typography, Box, useTheme } from "@mui/material";
import ArrowDropUpSharpIcon from "@mui/icons-material/ArrowDropUpSharp";
import ArrowDropDownSharpIcon from "@mui/icons-material/ArrowDropDownSharp";

const TotalTransaction = ({ transaction, type }) => {
  const incomeColor = "#4CAF50";
  const expenseColor = "#FF474C";
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

const findTotalForMonth = (transactions) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const currentMonthTransaction = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    return (
      transactionDate.getMonth() === currentMonth &&
      transactionDate.getFullYear() === currentYear
    );
  });

  if (currentMonthTransaction.length === 0) return 0;

  let totalTransaction = 0;

  for (const transaction of currentMonthTransaction) {
    totalTransaction += transaction.amount;
  }

  return totalTransaction;
};
