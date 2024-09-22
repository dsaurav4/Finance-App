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
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import AddBudget from "../widgets/AddBudget";
import { setBudgets } from "../../state/index.js";
import BudgetProgress from "../widgets/BudgetProgress.jsx";
import { parseISO, isWithinInterval } from "date-fns";
import WidgetWrapper from "../../components/WidgetWrapper.jsx";
import FlexBetween from "../../components/FlexBetween.jsx";
import {
  calculateTotalBudget,
  calculateTotalExpenses,
} from "../widgets/BudgetProgress.jsx";
import { Gauge, gaugeClasses } from "@mui/x-charts";
import { useNavigate } from "react-router-dom";

/**/
/*
NAME

        Budget - renders the budget tracking interface, allowing the user to select
        between weekly and monthly budget periods, and view active, expired, and 
        upcoming budgets.

SYNOPSIS

        Budget();

DESCRIPTION

        This component fetches and displays the user's budget plans. It allows the
        user to switch between "Weekly" and "Monthly" budget periods, and view
        budgets in three categories: active, expired, and upcoming. The selection
        of the period is controlled via a button and menu.

        The component makes use of React hooks, including useState, useEffect, 
        and useSelector to manage state and retrieve user data and budget plans 
        from the Redux store.

        It displays the following sections:
        - Active Budget Plans
        - Expired Budget Plans
        - Upcoming Budget Plans

RETURNS

        The component returns a JSX element containing the budget tracking interface.
*/
/**/
const Budget = () => {
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const userId = useSelector((state) => state.user._id);
  const token = useSelector((state) => state.token);
  const dispatch = useDispatch();
  const [period, setPeriod] = useState("Weekly");

  const periods = ["Weekly", "Monthly"];
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { palette } = useTheme();

  /**/
  /*
  NAME

          handleClick - sets the anchor element for the period selection menu.

  SYNOPSIS

          handleClick( event );
              event   --> the event object from the click action.

  DESCRIPTION

          This function captures the event when the user clicks on the period selection
          button and sets the anchor element to open the corresponding menu.

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

          handlePeriodSelect - handles the selection of a period from the menu.

  SYNOPSIS  

          handlePeriodSelect( period );
              period   --> the selected period from the menu (weekly or monthly).

  DESCRIPTION

          This function updates the state of the selected period and closes the 
          menu.

  RETURNS 

          No return value.

  */
  /**/
  const handlePeriodSelect = (period) => {
    setPeriod(period);
    handleClose();
  };

  /**/
  /*
  NAME

          handleClose - closes the menu.

  SYNOPSIS

          handleClose( event );
              event   --> the event object from the click action.

  DESCRIPTION

          This function closes the menu.

  RETURNS

          No return value.

  */
  /**/
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    getBudgets(userId, token, dispatch, setBudgets);
  }, []);

  const budgets = useSelector((state) => state.budgets);

  const weeklyBudgets = budgets.filter((budget) => budget.period === "Weekly");
  const monthlyBudgets = budgets.filter(
    (budget) => budget.period === "Monthly"
  );

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
        {/* Add Budget Component */}
        <AddBudget />
        <Box
          gap="0.5rem"
          sx={{ display: "flex", gap: "1rem", marginTop: "1rem" }}
        >
          <Typography sx={{ display: "flex", alignItems: "center" }}>
            SELECT PERIOD
          </Typography>
          <Box>
            <Button
              id="period-button"
              aria-controls={open ? "period-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
              sx={{
                border: `2px solid ${palette.neutral.dark}`,
                borderRadius: "8px",
                padding: "8px 16px",
                color: "inherit",
                width: "5rem",
              }}
            >
              {period}
            </Button>
            <Menu
              id="period-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "period-button",
              }}
            >
              {periods.map((period) => (
                <MenuItem
                  key={period}
                  onClick={() => handlePeriodSelect(period)}
                >
                  {period}
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
          {/* Active Budget Plans */}
          <Typography
            variant="h2"
            sx={{
              fontWeight: "bolder",
              textAlign: "center",
              width: "100%",
              marginTop: "2rem",
            }}
          >
            ACTIVE BUDGET PLANS
          </Typography>
          {period === "Weekly" ? (
            <BudgetProgress
              budget={getActiveBudget(weeklyBudgets)}
              showChart={true}
              active={true}
            />
          ) : (
            <BudgetProgress
              budget={getActiveBudget(monthlyBudgets)}
              showChart={true}
              active={true}
            />
          )}
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: "2rem",
          }}
        >
          {/* Expired Budget Plans */}
          <Typography
            variant="h2"
            sx={{
              fontWeight: "bolder",
              textAlign: "center",
              width: "100%",
              marginTop: "2rem",
            }}
          >
            EXPIRED BUDGET PLANS
          </Typography>
          {period === "Weekly" &&
          getExpiredBudgets(weeklyBudgets).length > 0 ? (
            getExpiredBudgets(weeklyBudgets).map((budget) => (
              <BudgetProgress
                key={budget._id}
                budget={budget}
                showChart={true}
                expired={true}
              />
            ))
          ) : period === "Monthly" &&
            getExpiredBudgets(monthlyBudgets).length > 0 ? (
            getExpiredBudgets(monthlyBudgets).map((budget) => (
              <BudgetProgress
                key={budget._id}
                budget={budget}
                showChart={true}
                expired={true}
              />
            ))
          ) : (
            <WidgetWrapper sx={{ p: "3rem" }}>
              <Typography sx={{ textAlign: "center" }}>
                No Expired Budgets
              </Typography>
            </WidgetWrapper>
          )}
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: "2rem",
          }}
        >
          {/* Upcoming Budget Plans */}
          <Typography
            variant="h2"
            sx={{
              fontWeight: "bolder",
              textAlign: "center",
              width: "100%",
              marginTop: "2rem",
            }}
          >
            UPCOMING BUDGET PLANS
          </Typography>
          {period === "Weekly" && getFutureBudgets(weeklyBudgets).length > 0 ? (
            getFutureBudgets(weeklyBudgets).map((budget) => (
              <BudgetProgress
                key={budget._id}
                budget={budget}
                showChart={false}
                upcoming={true}
              />
            ))
          ) : period === "Monthly" &&
            getFutureBudgets(monthlyBudgets).length > 0 ? (
            getFutureBudgets(monthlyBudgets).map((budget) => (
              <BudgetProgress
                key={budget._id}
                budget={budget}
                showChart={false}
                upcoming={true}
              />
            ))
          ) : (
            <WidgetWrapper sx={{ p: "3rem" }}>
              <Typography sx={{ textAlign: "center" }}>
                No Upcoming Budgets
              </Typography>
            </WidgetWrapper>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Budget;

/**/
/*
NAME

        getBudgets - fetches budget data for the specified user from the server.

SYNOPSIS

        getBudgets( userId, token, dispatch, setBudgets );
            userId     --> the ID of the user whose budgets are to be fetched.
            token      --> the authentication token for the API request.
            dispatch   --> the Redux dispatch function for updating the state.
            setBudgets --> action creator function for setting the budgets in the state.

DESCRIPTION

        This function makes an asynchronous GET request to retrieve the user's budgets
        from the server. It sends the user's ID and token in the request header for
        authorization. If the request is successful, it updates the Redux state with
        the fetched budget data. In case of failure, an error is logged to the console.

RETURNS

        No return value.
*/
/**/
export const getBudgets = async (userId, token, dispatch, setBudgets) => {
  try {
    const response = await fetch(
      `http://localhost:3001/budgets/${userId}/budgets`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      console.log("Error Occured!");
      return;
    }

    const data = await response.json();
    dispatch(setBudgets({ budgets: data }));
  } catch (error) {
    console.log("An error occured!");
    return;
  }
};

/**/
/*
NAME

        DashboardBudget - a functional component that renders a dashboard for budget
        plans.

SYNOPSIS

        DashboardBudget();
          
DESCRIPTION

        This component renders a dashboard for budget plans. It displays budget
        plans for weekly and monthly periods, as well as the total budget and
        remaining budget. It also includes a button that allows the user to add
        new budget plans.

RETURNS

        A React component that displays the dashboard for budget plans.

*/
/**/
export const DashboardBudget = () => {
  const budgets = useSelector((state) => state.budgets);
  const expenses = useSelector((state) => state.expenses);

  const weeklyBudgets = budgets.filter((budget) => budget.period === "Weekly");
  const monthlyBudgets = budgets.filter(
    (budget) => budget.period === "Monthly"
  );

  const navigate = useNavigate();
  const { palette } = useTheme();
  const periods = ["Weekly", "Monthly"];
  const [period, setPeriod] = useState("Weekly");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  /**/
  /*
  NAME  

          handleClick - opens the menu when the button is clicked.

  SYNOPSIS

          handleClick(event);
              event --> the event that triggered the button click.

  DESCRIPTION 

          This function opens the menu when the button is clicked. It sets the  
          anchor element to the clicked element.

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

          handlePeriodSelect - handles the selection of a budget period.

  SYNOPSIS

          handlePeriodSelect(period);
              period --> the selected budget period.  


  DESCRIPTION

          This function updates the state of the selected budget period and closes
          the menu.

  RETURNS

          No return value.


  */
  /**/
  const handlePeriodSelect = (period) => {
    setPeriod(period);
    handleClose();
  };

  /**/
  /*
  NAME

          handleClose - closes the menu when an option is selected.


  SYNOPSIS  

          handleClose();
              

  DESCRIPTION

          This function closes the menu when an option is selected. It is called
          when the user selects an option from the menu.

  RETURNS

          No return value.


  */
  /**/
  const handleClose = () => {
    setAnchorEl(null);
  };

  // get the active budget for the selected period
  const budget = getActiveBudget(
    period === "Monthly" ? monthlyBudgets : weeklyBudgets
  );

  // calculate the total budget
  const totalBudget = budget ? calculateTotalBudget(budget) : 0;

  // calculate the remaining budget
  const totalExpenses = budget
    ? calculateTotalExpenses(budget, expenses, true, false)
    : 0;

  return (
    <WidgetWrapper width="100%">
      {/* The button and menu for selecting the budget period */}
      <Button
        id="period-button"
        aria-controls={open ? "period-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{
          border: `2px solid ${palette.neutral.dark}`,
          borderRadius: "8px",
          padding: "8px 16px",
          color: "inherit",
        }}
      >
        {period}
      </Button>
      <Menu
        id="period-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "period-button",
        }}
      >
        {/* Create a menu item for each period in the periods array */}
        {periods.map((period) => (
          <MenuItem key={period} onClick={() => handlePeriodSelect(period)}>
            {period}
          </MenuItem>
        ))}
      </Menu>
      {/* The active budget plan display */}
      <FlexBetween sx={{ flexDirection: "column", width: "100%" }}>
        <Typography
          sx={{ fontWeight: "bolder", marginBottom: "1rem" }}
          variant="h6"
        >
          Active {period} Budget Plan
        </Typography>
        {/* Display a gauge if there is an active budget plan */}
        {budget ? (
          <Gauge
            width={200}
            height={200}
            value={totalExpenses}
            valueMax={totalBudget}
            text={({ value, valueMax }) => `$${value} / $${valueMax}`}
            sx={{
              [`& .${gaugeClasses.valueText}`]: {
                fontSize: 13,
                transform: "translate(0px, 0px)",
              },
              [`& .${gaugeClasses.valueArc}`]: {
                fill: totalExpenses > totalBudget ? "red" : "#52b202",
              },
              cursor: "pointer",
            }}
            onClick={() => navigate("/budget")}
          ></Gauge>
        ) : (
          <Typography>No Active {period} Plan.</Typography>
        )}
      </FlexBetween>
    </WidgetWrapper>
  );
};

/**/
/*
NAME

        calculateTotalBudget - calculates the total budget for a budget plan. 

SYNOPSIS

        calculateTotalBudget(budget);
            budget --> the budget plan.


DESCRIPTION

        This function calculates the total budget for a budget plan. It takes
        in the budget plan and returns the total budget.

RETURNS   

        The total budget for the budget plan.


*/
/**/
const getActiveBudget = (budgets) => {
  const today = new Date();

  return budgets.find((budget) =>
    isWithinInterval(today, {
      start: parseISO(budget.startDate),
      end: parseISO(budget.endDate),
    })
  );
};

/**
/*
NAME

        getExpiredBudgets - Retrieves a list of budgets that have an end date in the past.

SYNOPSIS

        getExpiredBudgets(budgets);
            budgets --> An array of budget objects.


DESCRIPTION 

        This function retrieves a list of budgets that have an end date in the past.

RETURNS

        An array of budget objects with an end date in the past.


*/
/**/
const getExpiredBudgets = (budgets) => {
  const today = new Date();

  return budgets.filter((budget) => parseISO(budget.endDate) < today);
};

/**
/*
NAME

        getFutureBudgets - Retrieves a list of budgets that have a start date in the future.

SYNOPSIS  

        getFutureBudgets(budgets);
            budgets --> An array of budget objects. 


DESCRIPTION 

        This function retrieves a list of budgets that have a start date in the future.

RETURNS 

        An array of budget objects with a start date in the future.

*/
/**/
const getFutureBudgets = (budgets) => {
  const today = new Date();

  return budgets.filter((budget) => parseISO(budget.startDate) > today);
};
