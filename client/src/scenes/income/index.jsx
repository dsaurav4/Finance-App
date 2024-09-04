import Navbar from "../navbar";
import { Box, useMediaQuery } from "@mui/material";
import AddTransactionWidget from "../widgets/AddTransactionWidget";
import Chart from "../widgets/Chart";
import { useSelector, useDispatch } from "react-redux";
import { setIncomes } from "../../state";
import { useEffect, useState } from "react";
import HighestCard from "../widgets/HighestCard";
import TransactionTable from "../widgets/TransactionsTable";

const Income = () => {
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const userId = useSelector((state) => state.user._id);
  const token = useSelector((state) => state.token);
  const dispatch = useDispatch();
  const [year, setYear] = useState(new Date().getFullYear());

  const getIncomes = async () => {
    const response = await fetch(
      `http://localhost:3001/transactions/${userId}/income`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await response.json();

    dispatch(setIncomes({ incomes: data }));
  };

  useEffect(() => {
    getIncomes();
  }, []);

  const incomes = useSelector((state) => state.incomes);

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
          <AddTransactionWidget transaction="income" pageType="add" />
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "60%" : undefined}
          sx={{ marginTop: "1rem" }}
        >
          <Chart
            transactionsType="income"
            transactions={incomes}
            year={year}
            setYear={setYear}
          />
        </Box>
        <Box></Box>
      </Box>
      <Box
        width="100%"
        padding={`0 6%`}
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
            headerMessage="Highest Income This Month"
            amount={incomes.length > 0 ? findHighestIncome(incomes).amount : 0}
            type="income"
            description={
              incomes.length > 0
                ? findHighestIncome(incomes).description
                : "No Data"
            }
            category={
              incomes.length > 0 ? findHighestIncome(incomes).category : null
            }
          ></HighestCard>
          <HighestCard
            headerMessage="Highest Income Category This Month"
            amount={
              incomes.length > 0 ? findHighestIncomeCategory(incomes).amount : 0
            }
            type="income"
            description={
              incomes.length > 0
                ? findHighestIncomeCategory(incomes).category
                : "No Data"
            }
            category={
              incomes.length > 0
                ? findHighestIncomeCategory(incomes).category
                : "No data"
            }
          ></HighestCard>
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "60%" : undefined}
          sx={{ marginTop: "1rem" }}
        >
          <TransactionTable
            type="income"
            transactions={incomes}
          ></TransactionTable>
        </Box>
      </Box>
    </Box>
  );
};

export default Income;

const findHighestIncome = (incomes) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const currentMonthIncomes = incomes.filter((income) => {
    const incomeDate = new Date(income.date);
    return (
      incomeDate.getMonth() === currentMonth &&
      incomeDate.getFullYear() === currentYear
    );
  });

  if (currentMonthIncomes.length === 0)
    return { amount: 0, description: "No Data This Month" };

  let highestIncome,
    highestAmount = 0;
  for (const income of currentMonthIncomes) {
    if (income.amount > highestAmount) {
      highestIncome = income;
      highestAmount = income.amount;
    }
  }

  return highestIncome;
};

const findHighestIncomeCategory = (incomes) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const currentMonthIncomes = incomes.filter((income) => {
    const incomeDate = new Date(income.date);
    return (
      incomeDate.getMonth() === currentMonth &&
      incomeDate.getFullYear() === currentYear
    );
  });

  if (currentMonthIncomes.length === 0)
    return { amount: 0, category: "No Data This Month" };

  const incomeByCategory = currentMonthIncomes.reduce((acc, income) => {
    const { category, amount } = income;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += amount;
    return acc;
  }, {});

  let highestCategory = null;
  let highestAmount = 0;

  for (const category in incomeByCategory) {
    if (incomeByCategory[category] > highestAmount) {
      highestCategory = category;
      highestAmount = incomeByCategory[category];
    }
  }

  return { category: highestCategory, amount: highestAmount };
};
