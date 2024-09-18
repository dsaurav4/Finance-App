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

const Dashboard = () => {
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const navigate = useNavigate();
  const [period, setPeriod] = useState("Monthly");

  const userId = useSelector((state) => state.user._id);
  const token = useSelector((state) => state.token);
  const dispatch = useDispatch();

  useEffect(() => {
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
        <Box
          flexBasis={isNonMobileScreens ? "50%" : undefined}
          sx={{ marginTop: "1rem" }}
        >
          <FlexBetween flexDirection="column" gap="1rem">
            <DashboardBudget />
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
        <Box
          flexBasis={isNonMobileScreens ? "50%" : undefined}
          sx={{ marginTop: "1rem" }}
        >
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
        <Box
          flexBasis={isNonMobileScreens ? "100%" : undefined}
          sx={{ marginTop: "1rem" }}
        >
          <DashboardChart period={period} setPeriod={setPeriod} />
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
