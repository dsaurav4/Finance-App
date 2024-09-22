import { Divider, IconButton, Typography, useMediaQuery } from "@mui/material";
import WidgetWrapper from "../../components/WidgetWrapper";
import FlexBetween from "../../components/FlexBetween";
import BudgetChart from "./BudgetChart";
import { useSelector, useDispatch } from "react-redux";
import { differenceInDays, parseISO, isWithinInterval } from "date-fns";
import DeleteDialogBox from "../../components/DeleteDialogBox.jsx";
import { Delete } from "@mui/icons-material";
import { useState } from "react";
import { setBudgets } from "../../state";
import Alerts from "../../components/Alerts.jsx";

/**/
/*
NAME

        BudgetProgress - A widget that displays the progress of a budget plan.

SYNOPSIS

        BudgetProgress({ budget, showChart, active, expired });
            budget      --> an object containing the budget data, including startDate, endDate, amount, and period.
            showChart   --> a boolean flag to determine whether to display the budget chart.
            active      --> a boolean flag to determine whether the budget is active.
            expired     --> a boolean flag to determine whether the budget has expired.
            

DESCRIPTION

        This component displays the progress of a budget plan, including the total spend, projected spend,
        average daily spend, and suggested action. The component calculates the total budget and total expenses
        for the given budget period and displays the percentage of total expenses against the total budget.
        It also calculates the average daily expense and the expected daily average, displaying the percentage
        of the average daily expense against the expected daily average. The component also calculates the projected
        expense and displays the percentage of the projected expense against the total budget. The component includes
        a delete button to delete the budget plan and a chart to display the budget breakdown. The component also
        displays an alert message to indicate the success or failure of the delete operation. The component is
        responsive and adjusts its layout based on the screen size. The component uses the current theme for styling.

RETURNS

        Returns JSX elements that render the budget progress widget.
*/
/**/
const BudgetProgress = ({ budget, showChart, active, expired }) => {
  // Whether the screen is a non-mobile screen
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  // The dispatch function for updating the state
  const dispatch = useDispatch();
  // The expenses from the state
  const expenses = useSelector((state) => state.expenses);
  // A flag to determine whether the delete dialog box is open or not
  const [openDelete, setOpenDelete] = useState(false);
  // The user ID from the state
  const userId = useSelector((state) => state.user._id);
  // The authentication token from the state
  const token = useSelector((state) => state.token);

  // Alert message
  const [alert, setAlert] = useState("");
  // Alert severity (error, warning, info, success)
  const [severity, setSeverity] = useState("error");
  // Whether the alert is open or not
  const [alertOpen, setAlertOpen] = useState(false);

  /**/
  /*
  NAME

          handleAlertClose - Handles the close event for the alert message.

  SYNOPSIS

          handleAlertClose(event, reason);
              event       --> the event object.
              reason      --> the reason for closing the alert.

  DESCRIPTION

          This function handles the close event for the alert message. It checks the reason for closing
          the alert and sets the alert open state to false. The function is called when the user clicks
          outside the alert or presses the escape key.  

  RETURNS

          No return value.
  */
  /**/
  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertOpen(false);
  };

  /**/
  /*
  NAME  

          handleClickOpenDelete - Opens the delete dialog box.

  SYNOPSIS

          handleClickOpenDelete();

  DESCRIPTION

          This function opens the delete dialog box by setting the open state to true. It is called when  
          the user clicks the delete button. 

  RETURNS

          No return value.

  */
  /**/
  const handleClickOpenDelete = () => {
    setOpenDelete(true);
  };

  /**/
  /*
  NAME

          handleCloseDelete - Closes the delete dialog box.

  SYNOPSIS

          handleCloseDelete();

  DESCRIPTION

          This function closes the delete dialog box by setting the open state to false. It is called when
          the user clicks the close button on the dialog box. 

  RETURNS

          No return value.

  */
  /**/
  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  // The total budget for the selected period
  const totalBudget = budget ? calculateTotalBudget(budget) : 0;

  // The total expenses for the selected period
  const totalExpenses = budget
    ? calculateTotalExpenses(budget, expenses, active, expired)
    : 0;

  // The percentage of total expenses against total budget
  const expenditurePercentage =
    budget && ((totalExpenses / totalBudget) * 100).toFixed(2);

  // The average daily expense for the selected period
  const averageDailyExpense = budget
    ? (
        totalExpenses /
        (active
          ? daysSinceStartDate(budget.startDate)
          : daysInBudgetPlan(budget.startDate, budget.endDate))
      ).toFixed(2)
    : undefined;

  // The expected daily average for the selected period
  const expectedDailyAverage = budget
    ? (
        totalBudget / daysInBudgetPlan(budget.startDate, budget.endDate)
      ).toFixed(2)
    : undefined;

  // The percentage of average daily expense against expected daily average
  const averageDailyPercent = (
    (averageDailyExpense / expectedDailyAverage) *
    100
  ).toFixed(2);

  // The projected expense for the selected period
  const projectedExpense = budget
    ? (
        averageDailyExpense * daysInBudgetPlan(budget.startDate, budget.endDate)
      ).toFixed(2)
    : undefined;

  // The percentage of projected expense against total budget
  const projectedExpensePercent = (
    (projectedExpense / totalBudget) *
    100
  ).toFixed(2);

  // The color to be used for the projected expense based on whether it is above or below 100%
  const budgetColor = projectedExpensePercent < 100 ? "green" : "red";

  /**/
  /*
  NAME

          handleDelete - Handles the delete operation for the budget plan.

  SYNOPSIS

          handleDelete();

  DESCRIPTION

          This function handles the delete operation for the budget plan. It sends a DELETE request to the server
          to delete the budget plan. It updates the state with the new list of budget plans and displays a success
          message. If an error occurs, it displays an error message. It is called when the user confirms the delete
          operation in the dialog box. 

  RETURNS

          No return value.

  */
  /**/
  const handleDelete = async () => {
    try {
      // Deletes a budget plan by sending a DELETE request to the server.
      // It handles the response and updates the state accordingly.
      // If an error occurs, it displays an error message.
      const response = await fetch(
        `http://localhost:3001/budgets/${userId}/${budget._id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // The response from the server is expected to be in JSON format.
      const data = await response.json();

      // Updates the state with the new list of budget plans.
      dispatch(setBudgets({ budgets: data }));
      // Displays a success message.
      setAlert("Budget Plan deleted successfully.");
      setSeverity("success");
      setAlertOpen(true);
      // Closes the delete dialog box.
      handleCloseDelete();
    } catch (error) {
      // If an error occurs while deleting a budget plan,
      // display the error message in an alert.
      // The alert is red and has an error icon.
      // Close the delete dialog box.
      setAlert(error.message);
      setSeverity("error");
      setAlertOpen(true);
      handleCloseDelete();
    }
  };

  return (
    <WidgetWrapper sx={{ p: "3rem" }}>
      {budget ? (
        <>
          <FlexBetween sx={{ justifyContent: "space-between" }}>
            <Typography variant="h3">
              {`Budget Period: ${new Date(budget.startDate).toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )} - ${new Date(budget.endDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}`}{" "}
            </Typography>
            <IconButton onClick={handleClickOpenDelete}>
              <Delete />
            </IconButton>
          </FlexBetween>
          <Typography variant="h5">{`${budget.period} Budget: ${budget.amount}`}</Typography>
          <FlexBetween
            flexDirection={`${isNonMobileScreens ? "row" : "column"}`}
            sx={{ marginY: "2rem" }}
            gap="1rem"
          >
            <FlexBetween flexDirection="column" alignItems="flex-start">
              <Typography
                sx={{
                  width: "100%",
                  textAlign: "center",
                  marginBottom: "0.5rem",
                }}
              >
                Total Spend
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  width: "100%",
                  textAlign: "center",
                  marginBottom: "0.5rem",
                  fontWeight: "bolder",
                }}
              >
                <span
                  style={{ color: budgetColor }}
                >{`$${totalExpenses}`}</span>{" "}
                / {`$${totalBudget}`}
              </Typography>
              <Typography sx={{ width: "100%", textAlign: "center" }}>
                <span style={{ color: budgetColor }}>{`${
                  expenditurePercentage <= 100
                    ? `${expenditurePercentage}%`
                    : `$${totalExpenses - totalBudget}`
                }`}</span>{" "}
                {`${expenditurePercentage <= 100 ? "of" : "over"}`} the total
                allocated budget
              </Typography>
            </FlexBetween>
            {active ? (
              <>
                <Divider
                  orientation={`${
                    isNonMobileScreens ? "vertical" : "horizontal"
                  }`}
                  flexItem
                />
                <FlexBetween flexDirection="column" alignItems="flex-start">
                  <Typography
                    sx={{
                      width: "100%",
                      textAlign: "center",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Projected Spend
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      width: "100%",
                      textAlign: "center",
                      marginBottom: "0.5rem",
                      fontWeight: "bolder",
                    }}
                  >
                    <span
                      style={{ color: budgetColor }}
                    >{`$${projectedExpense}`}</span>
                  </Typography>
                  <Typography sx={{ width: "100%", textAlign: "center" }}>
                    <span style={{ color: budgetColor }}>
                      {projectedExpensePercent <= 100
                        ? `${projectedExpensePercent}%`
                        : `$${(projectedExpense - totalBudget).toFixed(2)}`}
                    </span>{" "}
                    {projectedExpensePercent <= 100 ? "of" : "over"} the total
                    allocated budget
                  </Typography>
                </FlexBetween>
              </>
            ) : (
              <></>
            )}
            <Divider
              orientation={`${isNonMobileScreens ? "vertical" : "horizontal"}`}
              flexItem
            />
            <FlexBetween flexDirection="column" alignItems="flex-start">
              <Typography
                sx={{
                  width: "100%",
                  textAlign: "center",
                  marginBottom: "0.5rem",
                }}
              >
                Average Daily Spend
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  width: "100%",
                  textAlign: "center",
                  marginBottom: "0.5rem",
                  fontWeight: "bolder",
                }}
              >
                <span
                  style={{ color: budgetColor }}
                >{`$${averageDailyExpense}`}</span>
                /day
              </Typography>
              <Typography sx={{ width: "100%", textAlign: "center" }}>
                <span style={{ color: budgetColor }}>
                  {averageDailyPercent <= 100
                    ? `${averageDailyPercent}%`
                    : `$${(averageDailyExpense - expectedDailyAverage).toFixed(
                        2
                      )}`}
                </span>{" "}
                {averageDailyPercent <= 100 ? "of" : "over"} the expected
                average daily budget
              </Typography>
            </FlexBetween>
            <Divider
              orientation={`${isNonMobileScreens ? "vertical" : "horizontal"}`}
              flexItem
            />
            <FlexBetween flexDirection="column" alignItems="flex-start">
              {active || expired ? (
                <>
                  {" "}
                  <Typography
                    sx={{
                      width: "100%",
                      textAlign: "center",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {active ? "Suggested Action" : "Remarks"}
                  </Typography>
                  <Typography
                    variant={projectedExpensePercent > 100 ? `h5` : `h4`}
                    sx={{
                      width: "100%",
                      textAlign: "center",
                      marginBottom: "0.5rem",
                      fontWeight: "bolder",
                      color: budgetColor,
                    }}
                  >
                    {projectedExpensePercent < 100
                      ? active
                        ? "Keep it Up!"
                        : "You were under budget!"
                      : active
                      ? "Lower your Expenses!"
                      : "You went over budget!"}
                  </Typography>
                  <Typography sx={{ width: "100%", textAlign: "center" }}>
                    {active
                      ? projectedExpensePercent < 100
                        ? "You are well under budget!"
                        : "You are going over your budget!"
                      : ""}
                  </Typography>
                </>
              ) : (
                <>
                  <Typography
                    variant="h4"
                    sx={{
                      width: "100%",
                      textAlign: "center",
                      marginBottom: "0.5rem",
                      fontWeight: "bolder",
                    }}
                  >
                    - - - - -
                  </Typography>
                </>
              )}
            </FlexBetween>
          </FlexBetween>
          {showChart && <BudgetChart budget={budget} />}
        </>
      ) : (
        <Typography sx={{ textAlign: "center" }}>
          No Active Budget Plans for this Period
        </Typography>
      )}
      <DeleteDialogBox
        open={openDelete}
        handleClose={handleCloseDelete}
        handleDelete={handleDelete}
      />
      {alert && (
        <Alerts
          message={alert}
          severity={severity}
          open={alertOpen}
          onClose={handleAlertClose}
        />
      )}
    </WidgetWrapper>
  );
};

export default BudgetProgress;

/**/
/*
NAME

        calculateTotalBudget - Calculates the total budget for a given budget object.

SYNOPSIS

        calculateTotalBudget(budget);
            budget    --> an object containing the budget data, including startDate, endDate, amount, and period.

DESCRIPTION

        This function calculates the total budget for a given budget object based on the budget period and amount.
        It takes the budget object as input and returns the total budget amount. The function calculates the total
        number of days in the budget period and then calculates the total budget based on the period and amount. The
        function supports weekly and monthly budget periods. For weekly budgets, the function calculates the total
        budget by multiplying the number of weeks in the budget period by the weekly amount. For monthly budgets, the
        function calculates the total budget by multiplying the number of months in the budget period by the monthly
        amount. The function uses date-fns functions to parse dates and calculate the difference between dates. 

RETURNS

        Returns the total budget amount for the given budget object.

*/
/**/
export const calculateTotalBudget = (budget) => {
  // Retrieve the start date, end date, amount, and period from the budget object
  const { startDate, endDate, amount, period } = budget;
  // Parse the start and end dates from strings to Date objects
  const start = parseISO(startDate);
  const end = parseISO(endDate);

  // Calculate the total number of days in the budget period
  const totalDays = differenceInDays(end, start) + 1;
  // Initialize the total budget to 0
  let totalBudget = 0;

  if (period === "Weekly") {
    // Calculate the total number of weeks in the budget period
    const weeks = totalDays / 7;
    // Calculate the total budget by multiplying the number of weeks by the weekly amount
    totalBudget = weeks * amount;
  } else if (period === "Monthly") {
    // Calculate the total number of months in the budget period
    const months = totalDays / 30;
    // Calculate the total budget by multiplying the number of months by the monthly amount
    totalBudget = months * amount;
  }

  return totalBudget;
};

/**/
/*
NAME

        calculateTotalExpenses - Calculates the total expenses for a given budget.

SYNOPSIS

        calculateTotalExpenses(budget, expenses, active, expired);
            budget    --> an object containing the budget data, including startDate, endDate, amount, and period.
            expenses  --> an array of expense objects.
            active    --> a boolean flag to determine whether the budget is active.
            expired   --> a boolean flag to determine whether the budget has expired.

DESCRIPTION

        This function calculates the total expenses for a given budget based on the budget period and the list of
        expenses. It takes the budget object, an array of expense objects, and two boolean flags as input and returns
        the total expenses for the budget. The function filters the expenses based on the budget period and then calculates
        the total expenses by summing up the amounts of the filtered expenses. The function uses date-fns functions to parse
        dates and check if a date is within a given interval. If the budget is active, the function includes expenses up to
        today's date. If the budget has expired, the function includes expenses up to the budget end date. 

RETURNS

        Returns the total expenses for the given budget.

*/
/**/
export const calculateTotalExpenses = (budget, expenses, active, expired) => {
  // Retrieve today's date
  const today = new Date();
  // Retrieve the start date from the budget object
  const { startDate } = budget;
  // Parse the start date from a string to a Date object
  const start = parseISO(startDate);

  // Filter the expenses array to only include expenses that are within the budget period
  // If the budget is active, include expenses up to today's date
  // If the budget has expired, include expenses up to the budget end date
  const totalExpenses = expenses
    .filter((expense) =>
      isWithinInterval(parseISO(expense.date), {
        start,
        end: active ? today : budget.endDate,
      })
    )
    // Calculate the total expenses by summing up the amounts of all the expenses
    .reduce((sum, expense) => sum + expense.amount, 0);

  // Return the total expenses
  return totalExpenses;
};

/*
const daysUntilDate = (targetDate) => {
  const today = new Date();
  const target = new Date(targetDate);

  const diffInMs = target - today;

  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

  return diffInDays;
};
*/

/**/
/*
NAME

        daysSinceStartDate - Calculates the number of days since the start date of a budget plan.

SYNOPSIS

        daysSinceStartDate(startDate);
            startDate    --> the start date of the budget plan in ISO format.

DESCRIPTION

        This function calculates the number of days since the start date of a budget plan. It takes the start date
        of the budget plan as input and returns the number of days since the start date. The function uses the differenceInDays
        function from date-fns to calculate the difference in days between today's date and the start date. The function adds
        1 to the result to include the start date in the count. 

RETURNS

        Returns the number of days since the start date of the budget plan.

*/
/**/
const daysSinceStartDate = (startDate) => {
  // Get today's date
  const today = new Date();
  // Parse the start date from a string to a Date object
  const start = parseISO(startDate);

  // Calculate the difference in days between today and the start date
  const diffInDays = differenceInDays(today, start) + 1;

  // Return the number of days since the start date
  return diffInDays;
};

/**/
/*
NAME

        daysInBudgetPlan - Calculates the number of days in a budget plan.

SYNOPSIS

        daysInBudgetPlan(startDate, endDate);
            startDate    --> the start date of the budget plan in ISO format.
            endDate      --> the end date of the budget plan in ISO format.

DESCRIPTION

        This function calculates the number of days in a budget plan. It takes the start date and end date of the budget
        plan as input and returns the total number of days in the budget plan. The function uses the differenceInDays function
        from date-fns to calculate the difference in days between the start and end dates. The function adds 1 to the result to
        include the start and end date in the count. 

RETURNS

        Returns the total number of days in the budget plan.

*/
/**/
const daysInBudgetPlan = (startDate, endDate) => {
  // Parse the start and end dates from strings to Date objects
  const start = parseISO(startDate);
  const end = parseISO(endDate);

  // Calculate the difference in days between the start and end dates
  // Add 1 to include the start and end date in the count
  const diffInDays = differenceInDays(end, start) + 1;

  // Return the total number of days in the budget plan
  return diffInDays;
};
