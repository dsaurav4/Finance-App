import Navbar from "../navbar";
import {
  Box,
  Typography,
  useMediaQuery,
  useTheme,
  Button,
  Menu,
  MenuItem,
  LinearProgress,
} from "@mui/material";
import AddSavingGoal from "../widgets/AddSavingGoal";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { setSavingGoals } from "../../state";
import { isBefore, isAfter, isWithinInterval } from "date-fns";
import SavingGoalProgress from "../widgets/SavingGoalProgress";
import WidgetWrapper from "../../components/WidgetWrapper";
import FlexBetween from "../../components/FlexBetween";

/**/
/*
NAME

        SavingGoals - The saving goals component.

SYNOPSIS

        SavingGoals()

DESCRIPTION

        The saving goals component is the main component of the application. It is
        responsible for rendering the dashboard UI, including the chart, table, and
        buttons for adding, editing, and deleting saving goals.

RETURNS

        The SavingGoals component.

*/
/**/
const SavingGoals = () => {
  // checks if the screen is a non-mobile screen
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  // gets the user's id and token from the state
  const userId = useSelector((state) => state.user._id);
  const token = useSelector((state) => state.token);
  // gets the dispatch method from the state
  const dispatch = useDispatch();

  // the different types of goals
  const goalTypes = ["Active/Upcoming", "Expired/Complete"];
  // the anchor element for the menu
  const [anchorEl, setAnchorEl] = useState(null);
  // whether the menu is open
  const open = Boolean(anchorEl);
  // the current theme
  const { palette } = useTheme();

  /**/
  /*
  NAME

          handleClick - Handles the selection of a saving goal type from the
          dropdown menu.

  SYNOPSIS

          handleClick(event);
            event --> The event object.

  DESCRIPTION

          Handles the selection of a saving goal type from the dropdown menu by
          setting the state of the selected saving goal type and closing the
          menu.

  RETURNS

          No return value.

  */
  /**/
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  /**/
  /*
  NAME

          handleGoalTypeSelect - Handles the selection of a saving goal type from
          the dropdown menu.

  SYNOPSIS

          handleGoalTypeSelect(savingGoalType);
            savingGoalType --> The selected saving goal type.

  DESCRIPTION

          Handles the selection of a saving goal type from the dropdown menu by
          setting the state of the selected saving goal type and closing the
          menu.

  RETURNS

          No return value.

  */
  /**/
  const handleGoalTypeSelect = (savingGoalType) => {
    setSavingGoalType(savingGoalType);
    handleClose();
  };

  /**/
  /*
  NAME

          handleClose - Closes the dropdown menu. 

  SYNOPSIS

          handleClose();


  DESCRIPTION

          Closes the dropdown menu.

  RETURNS

          No return value.

  */
  /**/
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [savingGoalType, setSavingGoalType] = useState("Active/Upcoming");

  useEffect(() => {
    getSavingGoals(userId, token, dispatch, setSavingGoals);
  }, []);

  const savingGoals = useSelector((state) => state.savingGoals);

  const today = new Date();

  // filter active goals
  // a goal is active if its start date is before today and its end date is after today
  // and its current amount is less than its target amount
  const activeGoals = savingGoals.filter((goal) => {
    const startDate = new Date(goal.startDate);
    const endDate = new Date(goal.endDate);

    return (
      isWithinInterval(today, { start: startDate, end: endDate }) &&
      goal.currentAmount < goal.targetAmount
    );
  });

  // filter upcoming goals
  // a goal is upcoming if its start date is after today
  const upcomingGoals = savingGoals.filter((goal) => {
    const startDate = new Date(goal.startDate);

    return isAfter(startDate, today);
  });

  // filter incomplete goals
  // a goal is incomplete if its end date is before today and its current amount is less than its target amount
  const incompleteGoals = savingGoals.filter((goal) => {
    const endDate = new Date(goal.endDate);
    return isBefore(endDate, today) && goal.currentAmount < goal.targetAmount;
  });

  // filter completed goals
  // a goal is completed if its current amount is greater than or equal to its target amount
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
        {/* Add a new saving goal */}
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
                  <SavingGoalProgress
                    goal={goal}
                    active={true}
                    key={goal._id}
                  />
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
                  <SavingGoalProgress
                    goal={goal}
                    upcoming={true}
                    key={goal._id}
                  />
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
                  <SavingGoalProgress
                    goal={goal}
                    expired={true}
                    key={goal._id}
                  />
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
                  <SavingGoalProgress
                    goal={goal}
                    expired={true}
                    key={goal._id}
                  />
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

/**/
/*
NAME
    getSavingGoals - Fetch data from the server.  

SYNOPSIS

    getSavingGoals( userId, token, dispatch, setSavingGoals )
      userId --> The ID of the user whose saving goals are being fetched.
      token --> The authentication token for the user.
      dispatch --> The Redux dispatch function.
      setSavingGoals --> The function to update the state with the fetched saving goals.

DESCRIPTION
    Fetch data from the server using the getSavingGoals function.

RETURNS
    No return value.
*/
/**/
export const getSavingGoals = async (
  userId,
  token,
  dispatch,
  setSavingGoals
) => {
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

/**/
/*
NAME
       DashboardSaving - Renders the dashboard for saving goals.

SYNOPSIS

       DashboardSaving()

DESCRIPTION

       This function renders the dashboard for saving goals.

RETURNS 

       No return value.

*/
/**/
export const DashboardSaving = () => {
  const today = new Date();
  const savingGoals = useSelector((state) => state.savingGoals);

  const activeGoals = savingGoals.filter((goal) => {
    const startDate = new Date(goal.startDate);
    const endDate = new Date(goal.endDate);

    return (
      isWithinInterval(today, { start: startDate, end: endDate }) &&
      goal.currentAmount < goal.targetAmount &&
      goal.targetAmount > 0 // Prevent division by 0 in LinearProgress
    );
  });

  return (
    <WidgetWrapper width="100%" height="100%" sx={{ p: "3rem" }}>
      <FlexBetween sx={{ flexDirection: "column", width: "100%" }}>
        <Typography
          sx={{ fontWeight: "bolder", marginBottom: "1rem" }}
          variant="h6"
        >
          Recent Saving Goals
        </Typography>
        {/* If there are no active goals, display a message */}
        {activeGoals.length === 0 ? (
          <Typography>No active saving goals.</Typography>
        ) : (
          /* Otherwise, map over the active goals and display a progress bar for each one */
          activeGoals.map((goal) => (
            <div key={goal._id} style={{ width: "100%", marginBottom: "1rem" }}>
              <Typography variant="body1">
                {goal.goalName} (${goal.currentAmount} / ${goal.targetAmount})
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(goal.currentAmount / goal.targetAmount) * 100}
                sx={{ width: "100%" }}
              />
            </div>
          ))
        )}
      </FlexBetween>
    </WidgetWrapper>
  );
};
