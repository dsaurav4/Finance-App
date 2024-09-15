import Navbar from "../navbar";
import {
  Box,
  Typography,
  useMediaQuery,
  useTheme,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import AddSavingGoal from "../widgets/AddSavingGoal";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { setSavingGoals } from "../../state";
import { isBefore, isAfter, isWithinInterval } from "date-fns";
import SavingGoalProgress from "../widgets/SavingGoalProgress";
import WidgetWrapper from "../../components/WidgetWrapper";

const SavingGoals = () => {
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const userId = useSelector((state) => state.user._id);
  const token = useSelector((state) => state.token);
  const dispatch = useDispatch();

  const goalTypes = ["Active/Upcoming", "Expired/Complete"];
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { palette } = useTheme();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleGoalTypeSelect = (savingGoalType) => {
    setSavingGoalType(savingGoalType);
    handleClose();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getSavingGoals = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/savingGoals/${userId}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        console.log("Error Occured!");
        return;
      }

      const data = await response.json();
      dispatch(setSavingGoals({ savingGoals: data }));
    } catch (error) {
      console.log("An unexpected error occured: ", error);
    }
  };

  const [savingGoalType, setSavingGoalType] = useState("Active/Upcoming");

  useEffect(() => {
    getSavingGoals();
  }, []);

  const savingGoals = useSelector((state) => state.savingGoals);

  const today = new Date();

  const activeGoals = savingGoals.filter((goal) => {
    const startDate = new Date(goal.startDate);
    const endDate = new Date(goal.endDate);

    return (
      isWithinInterval(today, { start: startDate, end: endDate }) &&
      goal.currentAmount < goal.targetAmount
    );
  });

  const upcomingGoals = savingGoals.filter((goal) => {
    const startDate = new Date(goal.startDate);

    return isAfter(startDate, today);
  });

  const incompleteGoals = savingGoals.filter((goal) => {
    const endDate = new Date(goal.endDate);
    return isBefore(endDate, today) && goal.currentAmount < goal.targetAmount;
  });

  const completedGoals = savingGoals.filter((goal) => {
    return goal.currentAmount >= goal.targetAmount;
  });

  return (
    <Box sx={{ paddingBottom: "3rem" }}>
      <Navbar />
      <Box
        width={`${isNonMobileScreens ? "75%" : "100%"}`}
        padding={`0 6%`}
        display={isNonMobileScreens ? "flex" : "block"}
        flexDirection="column"
        gap="2rem"
        justifyContent="space-between"
        sx={{
          marginTop: "1rem",
          marginX: `${isNonMobileScreens ? "12.5%" : undefined}`,
        }}
      >
        <AddSavingGoal />
        <Box
          gap="0.5rem"
          sx={{
            display: "flex",
            gap: "1rem",
            marginY: `${!isNonMobileScreens ? "2rem" : "1rem"}`,
            marginX: `${isNonMobileScreens ? "12.5%" : undefined}`,
          }}
        >
          <Typography sx={{ display: "flex", alignItems: "center" }}>
            SELECT GOAL TYPE
          </Typography>
          <Box>
            <Button
              id="goalType-button"
              aria-controls={open ? "goalType-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
              sx={{
                border: `2px solid ${palette.neutral.dark}`,
                borderRadius: "8px",
                padding: "8px 16px",
                color: "inherit",
                width: "10rem",
              }}
            >
              {savingGoalType}
            </Button>
            <Menu
              id="goalType-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "goalType-button",
              }}
            >
              {goalTypes.map((goalType) => (
                <MenuItem
                  key={goalType}
                  onClick={() => handleGoalTypeSelect(goalType)}
                >
                  {goalType}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: "2rem",
          }}
        >
          {savingGoalType === "Active/Upcoming" ? (
            <>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: "bolder",
                  textAlign: "center",
                  width: "100%",
                  marginTop: "2rem",
                }}
              >
                CURRENT SAVING PLANS
              </Typography>
              {activeGoals.length > 0 ? (
                activeGoals.map((goal) => (
                  <SavingGoalProgress goal={goal} active={true} />
                ))
              ) : (
                <WidgetWrapper
                  sx={{
                    paddingY: "2rem",
                    marginX: `${isNonMobileScreens ? "12.5%" : undefined}`,
                  }}
                >
                  <Typography sx={{ textAlign: "center" }}>
                    NO ACTIVE SAVING PLANS!
                  </Typography>
                </WidgetWrapper>
              )}
              <Typography
                variant="h2"
                sx={{
                  fontWeight: "bolder",
                  textAlign: "center",
                  width: "100%",
                  marginTop: "2rem",
                }}
              >
                UPCOMING SAVING PLANS
              </Typography>
              {upcomingGoals.length > 0 ? (
                upcomingGoals.map((goal) => (
                  <SavingGoalProgress goal={goal} upcoming={true} />
                ))
              ) : (
                <WidgetWrapper
                  sx={{
                    paddingBottom: "3rem",
                    marginX: `${isNonMobileScreens ? "12.5%" : undefined}`,
                  }}
                >
                  <Typography sx={{ textAlign: "center" }}>
                    NO UPCOMING SAVING PLANS!
                  </Typography>
                </WidgetWrapper>
              )}
            </>
          ) : (
            <>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: "bolder",
                  textAlign: "center",
                  width: "100%",
                  marginTop: "2rem",
                }}
              >
                COMPLETED SAVING PLANS
              </Typography>
              {completedGoals.length > 0 ? (
                completedGoals.map((goal) => (
                  <SavingGoalProgress goal={goal} expired={true} />
                ))
              ) : (
                <WidgetWrapper
                  sx={{
                    paddingBottom: "3rem",
                    marginX: `${isNonMobileScreens ? "12.5%" : undefined}`,
                  }}
                >
                  <Typography sx={{ textAlign: "center" }}>
                    NO COMPLETED SAVING PLANS!
                  </Typography>
                </WidgetWrapper>
              )}
              <Typography
                variant="h2"
                sx={{
                  fontWeight: "bolder",
                  textAlign: "center",
                  width: "100%",
                  marginTop: "2rem",
                }}
              >
                INCOMPLETE SAVING PLANS
              </Typography>
              {incompleteGoals.length > 0 ? (
                incompleteGoals.map((goal) => (
                  <SavingGoalProgress goal={goal} expired={true} />
                ))
              ) : (
                <WidgetWrapper
                  sx={{
                    paddingBottom: "3rem",
                    marginX: `${isNonMobileScreens ? "12.5%" : undefined}`,
                  }}
                >
                  <Typography sx={{ textAlign: "center" }}>
                    NO INCOMPLETE SAVING PLANS!
                  </Typography>
                </WidgetWrapper>
              )}
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default SavingGoals;
