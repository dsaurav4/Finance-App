import {
  Divider,
  IconButton,
  Typography,
  useMediaQuery,
  Box,
} from "@mui/material";
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";
import WidgetWrapper from "../../components/WidgetWrapper";
import FlexBetween from "../../components/FlexBetween";
import BudgetChart from "./BudgetChart";
import { useSelector, useDispatch } from "react-redux";
import { differenceInDays, parseISO, isWithinInterval } from "date-fns";
import DeleteDialogBox from "../../components/DeleteDialogBox.jsx";
import { Delete, Upcoming } from "@mui/icons-material";
import { useState } from "react";
import { setSavingGoal } from "../../state";
import Alerts from "../../components/Alerts.jsx";

const SavingGoalProgress = ({ goal, active, expired, upcoming }) => {
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const dispatch = useDispatch();

  const [openDelete, setOpenDelete] = useState(false);
  const userId = useSelector((state) => state.user._id);
  const token = useSelector((state) => state.token);

  const [alert, setAlert] = useState("");
  const [severity, setSeverity] = useState("error");
  const [alertOpen, setAlertOpen] = useState(false);
  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertOpen(false);
  };

  const handleClickOpenDelete = () => {
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  return (
    <WidgetWrapper sx={{ p: "3rem" }}>
      <FlexBetween sx={{ flexDirection: "column" }} gap="2rem">
        <FlexBetween>
          <Typography variant="h3" sx={{ fontWeight: "bolder" }}>
            {goal.goalName}
          </Typography>
          <IconButton onClick={handleClickOpenDelete}>
            <Delete />
          </IconButton>
        </FlexBetween>
        <Gauge
          width={250}
          height={250}
          value={
            goal.currentAmount <= goal.targetAmount
              ? goal.currentAmount
              : goal.targetAmount
          }
          valueMax={goal.targetAmount}
          text={({ value, valueMax }) => `$${value} / $${valueMax}`}
          sx={{
            [`& .${gaugeClasses.valueText}`]: {
              fontSize: 20,
              transform: "translate(0px, 0px)",
            },
          }}
        />
      </FlexBetween>
    </WidgetWrapper>
  );
};

export default SavingGoalProgress;
