import Navbar from "../navbar";
import { Box, useMediaQuery } from "@mui/material";
import AddTransactionWidget from "../widgets/AddTransactionWidget";
import Chart from "../widgets/Chart";
import { useSelector, useDispatch } from "react-redux";
import { setExpenses } from "../../state";
import { useEffect, useState } from "react";
import HighestCard from "../widgets/HighestCard";
import TransactionTable from "../widgets/TransactionsTable";

const Expense = () => {
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const userId = useSelector((state) => state.user._id);
  const token = useSelector((state) => state.token);
  const dispatch = useDispatch();
  const [year, setYear] = useState(new Date().getFullYear());

  const getExpenses = async () => {
    const response = await fetch(
      `http://localhost:3001/transactions/${userId}/expense`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();

    dispatch(setExpenses({ expenses: data }));
  };

  useEffect(() => {
    getExpenses();
  }, []);

  const expenses = useSelector((state) => state.expenses);

  return (
    <Box sx={{ paddingBottom: "3rem" }}>
      <Navbar />

      <Box
        width="100%"
        padding={`${isNonMobileScreens ? "2rem" : 0} 6%`}
        display={isNonMobileScreens ? "flex" : "block"}
        gap="1rem"
        justifyContent="space-between"
      >
        <Box
          flexBasis={isNonMobileScreens ? "40%" : undefined}
          sx={{ marginTop: "1rem" }}
        >
          <AddTransactionWidget transaction="expense" pageType="add" />
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "60%" : undefined}
          sx={{ marginTop: "1rem" }}
        >
          <Chart
            transactionsType="expense"
            transactions={expenses}
            year={year}
            setYear={setYear}
          />
        </Box>
      </Box>

      <Box
        width="100%"
        padding="0rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="1rem"
        justifyContent="space-between"
      >
        <Box
          flexBasis={isNonMobileScreens ? "40%" : undefined}
          display="flex"
          flexDirection="column"
          gap="1rem"
          sx={{ marginTop: "1rem" }}
        >
          <HighestCard
            headerMessage="Highest Expense This Month"
            amount={
              expenses.length > 0 ? findHighestExpense(expenses).amount : 0
            }
            type="expense"
            description={
              expenses.length > 0
                ? findHighestExpense(expenses).description
                : "No Data"
            }
            category={
              expenses.length > 0
                ? findHighestExpense(expenses).category
                : " No Data"
            }
          ></HighestCard>
          <HighestCard
            headerMessage="Highest Expense Category This Month"
            amount={
              expenses.length > 0
                ? findHighestExpenseCategory(expenses).amount
                : 0
            }
            type="expense"
            description={
              expenses.length > 0
                ? findHighestExpenseCategory(expenses).category
                : "No Data"
            }
            category={
              expenses.length > 0
                ? findHighestExpenseCategory(expenses).category
                : "No Data"
            }
          ></HighestCard>
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "60%" : undefined}
          sx={{ marginTop: "1rem" }}
        >
          <TransactionTable
            type="expense"
            transactions={expenses}
          ></TransactionTable>
        </Box>
      </Box>
    </Box>
  );
};

export default Expense;

const findHighestExpense = (expenses) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const currentMonthExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    return (
      expenseDate.getMonth() === currentMonth &&
      expenseDate.getFullYear() === currentYear
    );
  });

  if (currentMonthExpenses.length === 0)
    return { amount: 0, description: "No Data This Month" };

  let highestExpense,
    highestAmount = 0;
  for (const expense of currentMonthExpenses) {
    if (expense.amount > highestAmount) {
      highestExpense = expense;
      highestAmount = expense.amount;
    }
  }
  return highestExpense;
};

const findHighestExpenseCategory = (expenses) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const currentMonthExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    return (
      expenseDate.getMonth() === currentMonth &&
      expenseDate.getFullYear() === currentYear
    );
  });

  if (currentMonthExpenses.length === 0)
    return { amount: 0, category: "No Data This Month" };

  // Aggregate the expense amounts by category
  const expenseByCategory = currentMonthExpenses.reduce((acc, expense) => {
    const { category, amount } = expense;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += amount;
    return acc;
  }, {});

  let highestCategory = null;
  let highestAmount = 0;

  for (const category in expenseByCategory) {
    if (expenseByCategory[category] > highestAmount) {
      highestCategory = category;
      highestAmount = expenseByCategory[category];
    }
  }

  return { category: highestCategory, amount: highestAmount };
};
