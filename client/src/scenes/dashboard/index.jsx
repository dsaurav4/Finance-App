import Navbar from "../navbar";
import { Box, useMediaQuery } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import DashboardChart from "../widgets/DashboardChart";
import DashboardTransactionTable from "../widgets/DashboardTable";
import { DashboardSaving, getSavingGoals } from "../savingGoals";
import { useNavigate } from "react-router-dom";
import FlexBetween from "../../components/FlexBetween";
import { DashboardBudget, getBudgets } from "../budget";
import {
  setIncomes,
  setExpenses,
  setBudgets,
  setSavingGoals,
} from "../../state";
import { getIncomes } from "../income";
import { getExpenses } from "../expense";

/**/
/*
NAME
    Dashboard - The dashboard component.

SYNOPSIS
    Dashboard()

DESCRIPTION
    The dashboard component is the main component of the application. It is
    responsible for rendering the dashboard UI, including the chart, table, and 
    saving goal components. It also provides functionality for changing the 
    period of the chart and table.

RETURNS
    The Dashboard component.
*/

const Dashboard = () => {
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const navigate = useNavigate();
  const [period, setPeriod] = useState("Monthly");

  const userId = useSelector((state) => state.user._id);
  const token = useSelector((state) => state.token);
  const dispatch = useDispatch();

  useEffect(() => {
    /**/
    /*
    NAME
        fetchData - Fetch data from the server.

    SYNOPSIS
        fetchData()

    DESCRIPTION
        Fetch data from the server using the getIncomes, getExpenses, getBudgets, and getSavingGoals functions.

    RETURNS
        None
    */
    async function fetchData() {
      getIncomes(userId, token, dispatch, setIncomes);
      getExpenses(userId, token, dispatch, setExpenses);
      getBudgets(userId, token, dispatch, setBudgets);
      getSavingGoals(userId, token, dispatch, setSavingGoals);
    }
    fetchData();
  }, []);

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
        {/* Left side of the dashboard */}
        <Box
          flexBasis={isNonMobileScreens ? "50%" : undefined}
          sx={{ marginTop: "1rem" }}
        >
          <FlexBetween flexDirection="column" gap="1rem">
            {/* Budget component */}
            <DashboardBudget />
            {/* Saving goal component with navigation */}
            <Box
              sx={{ cursor: "pointer" }}
              onClick={() => navigate("/savingGoal")}
              width="100%"
              height="100%"
            >
              <DashboardSaving />
            </Box>
          </FlexBetween>
        </Box>
        {/* Right side of the dashboard */}
        <Box
          flexBasis={isNonMobileScreens ? "50%" : undefined}
          sx={{ marginTop: "1rem" }}
        >
          {/* Transaction table component */}
          <DashboardTransactionTable />
        </Box>
      </Box>
      <Box
        width="100%"
        padding={`0 6%`}
        display={isNonMobileScreens ? "flex" : "block"}
        gap="1rem"
        justifyContent="space-between"
      >
        {/* Bottom section of the dashboard */}
        <Box
          flexBasis={isNonMobileScreens ? "100%" : undefined}
          sx={{ marginTop: "1rem" }}
        >
          {/* Chart component with period selection */}
          <DashboardChart period={period} setPeriod={setPeriod} />
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
