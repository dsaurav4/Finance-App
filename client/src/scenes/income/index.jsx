import Navbar from "../navbar";
import { Box, useMediaQuery } from "@mui/material";
import AddTransactionWidget from "../widgets/AddTransactionWidget";
import Chart from "../widgets/Chart";
import { useSelector, useDispatch } from "react-redux";
import { setIncomes } from "../../state";
import { useEffect, useState } from "react";
import HighestCard from "../widgets/HighestCard";
import TransactionTable from "../widgets/TransactionsTable";
import Piechart from "../widgets/Piechart";
import TotalTransaction from "../widgets/TotalTransaction";
import TransactionChangeCard from "../widgets/TransactionChangeCard";

/**/
/*
NAME
        Income - The Income page component .

SYNOPSIS

        Income()

DESCRIPTION
        The Income page component. This component displays the income page.

RETURNS
        The Income page component.
*/
/**/
const Income = () => {
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const userId = useSelector((state) => state.user._id);
  const token = useSelector((state) => state.token);
  const dispatch = useDispatch();
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    getIncomes(userId, token, dispatch, setIncomes);
  }, []);

  const incomes = useSelector((state) => state.incomes);

  return (
    <Box sx={{ paddingBottom: "3rem" }}>
      <Navbar />
      <Box
        width="100%"
        padding={`0 6%`}
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
      </Box>

      <Box
        width="100%"
        padding={`0 6%`}
        display={isNonMobileScreens ? "flex" : "block"}
        gap="1rem"
        justifyContent="space-between"
      >
        <Box
          display="flex"
          flexDirection="column"
          gap="1rem"
          sx={{ marginTop: "1rem" }}
          flexBasis={isNonMobileScreens ? "40%" : undefined}
        >
          <TransactionTable
            type="income"
            transactions={incomes}
          ></TransactionTable>
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "60%" : undefined}
          display="flex"
          flexDirection="column"
          gap="1rem"
          sx={{ marginTop: "1rem" }}
          justifyContent="center"
        >
          <TotalTransaction transaction={incomes} type="income" />
          <TransactionChangeCard transaction={incomes} type="income" />
        </Box>
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
            amount={
              incomes.length > 0
                ? findHighestIncome(incomes).amount.toFixed(2)
                : 0
            }
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
          <Piechart transactions={incomes} type="income" />
        </Box>
      </Box>
    </Box>
  );
};

export default Income;

/**/
/*
NAME
        getIncomes - Fetches the income data for a user from the server.

SYNOPSIS

        getIncomes( userId, token, dispatch, setIncomes );
          userId --> The ID of the user whose income data is to be fetched.
          token  --> The authentication token for the user.
          dispatch --> The Redux dispatch function.
          setIncomes --> The function to set the income data in the Redux store.

DESCRIPTION

        Fetches the income data for a user from the server. It handles the
        response and updates the state accordingly. If an error occurs, it
        displays an error message.

RETURNS
        None

*/
/**/

export const getIncomes = async (userId, token, dispatch, setIncomes) => {
  const response = await fetch(
    `http://localhost:3001/transactions/${userId}/income`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  try {
    const data = await response.json();
    if (!data.message) dispatch(setIncomes({ incomes: data }));
  } catch (error) {
    console.log(error);
  }
};

/**/
/*
NAME

        findHighestIncome - Finds the highest income for the current month.


SYNOPSIS

        findHighestIncome( incomes );
          incomes --> An array of income objects with date, amount, and category properties.

DESCRIPTION

        Finds the highest income for the current month from a list of incomes.

RETURNS

        An object containing the highest income amount and description.

*/
/**/
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

/**/
/*
NAME

        findHighestIncomeCategory - Finds the highest income category for the current month.


SYNOPSIS

        findHighestIncomeCategory( incomes );
          incomes --> An array of income objects with date, amount, and category properties.

DESCRIPTION

        Finds the highest income category for the current month from a list of incomes.

RETURNS

        An object containing the highest income amount and description.

*/
/**/
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

  return { category: highestCategory, amount: highestAmount.toFixed(2) };
};
