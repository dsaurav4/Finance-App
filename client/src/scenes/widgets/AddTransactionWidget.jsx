import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useTheme,
  useMediaQuery,
  Box,
  TextField,
  Typography,
  Button,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  InputAdornment,
} from "@mui/material";
import { AttachMoney, MoneyOff } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import * as yup from "yup";
import { Formik } from "formik";
import WidgetWrapper from "../../components/WidgetWrapper.jsx";
import FlexBetween from "../../components/FlexBetween.jsx";
import Alerts from "../../components/Alerts.jsx";
import {
  setIncomes,
  setExpenses,
  setIncome,
  setExpense,
} from "../../state/index.js";

// Validation schema for income and expenses
const incomeSchema = yup.object().shape({
  description: yup.string().notRequired(),
  amount: yup
    .number()
    .typeError("Amount must be a number")
    .required("Amount is required")
    .min(1, "Amount cannot be negative or zero"),
  date: yup
    .date()
    .typeError("Date must be a valid date")
    .required("Date is required"),
  category: yup
    .string()
    .oneOf(
      ["Salary", "Freelance", "Investments", "Gifts", "Business", "Other"],
      "Invalid category"
    )
    .required("Category is required"),
});

// Validation schema for expenses
const expenseSchema = yup.object().shape({
  description: yup.string().notRequired(),
  amount: yup
    .number()
    .typeError("Amount must be a number")
    .required("Amount is required")
    .min(1, "Amount cannot be negative or zero"),
  date: yup
    .date()
    .typeError("Date must be a valid date")
    .required("Date is required"),
  category: yup
    .string()
    .oneOf(
      [
        "Rent",
        "Utilities",
        "Groceries",
        "Food",
        "Entertainment",
        "Travel",
        "Healthcare",
        "Education",
        "Other",
      ],
      "Invalid category"
    )
    .required("Category is required"),
});

/**/
/*
NAME

        AddTransactionWidget - a component for adding or updating an income or expense transaction.

SYNOPSIS

        AddTransactionWidget({ transaction, pageType, editRow, handleCloseEdit });

            transaction        --> specifies whether the transaction is "income" or "expense".
            pageType           --> determines if the page is for adding or updating a transaction ("add" or "update").
            editRow            --> the transaction data to be edited, if applicable.
            handleCloseEdit    --> function to close the edit dialog.

DESCRIPTION

        This component renders a form for adding or updating an income or expense transaction.
        The form fields include description, amount, date, and category. 
        Based on the pageType, the component will either allow users to add a new transaction 
        or update an existing one. The form is validated using a schema and submissions 
        are handled with POST or PATCH requests to the server.

        It uses Formik for form handling and MUI for UI elements, including alerts
        for success or error messages. Transactions are either dispatched to the Redux store 
        upon successful submission or an alert is shown on error.

RETURNS

        Returns JSX elements that render the transaction form and display alerts for user feedback.
*/
/**/
const AddTransactionWidget = ({
  transaction,
  pageType,
  editRow,
  handleCloseEdit,
}) => {
  // Get the user ID, token, and theme from the state
  const dispatch = useDispatch();
  // Get the theme palette from the state
  const { palette } = useTheme();

  // Get the user ID and token from the state
  // The user ID is used to fetch the user's transactions
  // The token is used to authenticate the API requests
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);

  // Check if the screen size is non-mobile
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  // Set the initial state for the alert message
  const [alert, setAlert] = useState("");
  const [severity, setSeverity] = useState("error");
  const [alertOpen, setAlertOpen] = useState(false);

  // The initial values for the income form
  // If the page type is "add", then the initial values are empty
  // If the page type is "update", then the initial values are the values of the edit row
  const initialIncomeValues =
    pageType === "add"
      ? {
          description: "",
          amount: "",
          date: null,
          category: "",
        }
      : {
          description: editRow?.description || "",
          amount: editRow?.amount || "",
          date: editRow?.date ? dayjs(editRow.date) : null,
          category: editRow?.category || "",
        };

  // The initial values for the expense form
  // If the page type is "add", then the initial values are empty
  // If the page type is "update", then the initial values are the values of the edit row
  const initialExpenseValues =
    pageType === "add"
      ? {
          description: "",
          amount: "",
          date: null,
          category: "",
        }
      : {
          description: editRow?.description || "",
          amount: editRow?.amount || "",
          date: editRow?.date ? dayjs(editRow.date) : null,
          category: editRow?.category || "",
        };

  // The categories for income transactions
  const incomeCategories = [
    "Salary",
    "Freelance",
    "Investments",
    "Gifts",
    "Business",
    "Other",
  ];

  // The categories for expense transactions
  const expenseCategories = [
    "Rent",
    "Utilities",
    "Groceries",
    "Food",
    "Entertainment",
    "Travel",
    "Healthcare",
    "Education",
    "Other",
  ];

  /**/
  /*
  NAME

          income - a function to handle the submission of an income transaction.

  SYNOPSIS

          income(values, onSubmitProps);
            values            --> the values from the income form.
            onSubmitProps     --> the props for the form submission.

  DESCRIPTION

          This function handles the submission of an income transaction by sending a POST request to the server.
          It creates a new FormData object, appends the form values, and sends the request to the server.
          If the response is successful, it updates the incomes in the state and displays a success message.
          If the response is not successful, it displays an error message.

  RETURNS

          Returns a success message if the income is saved successfully, or an error message if there is an error.
  */
  /**/
  const income = async (values, onSubmitProps) => {
    // Create a new FormData object
    const formData = new FormData();

    // Append the form values to the FormData object
    formData.append("description", values.description);
    formData.append("amount", values.amount);
    formData.append("date", values.date);
    formData.append("category", values.category);

    // Send a POST request to the server to save the income transaction
    const response = await fetch(
      `http://localhost:3001/transactions/${_id}/income`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    // Reset the form
    onSubmitProps.resetForm();

    // Handle the response
    try {
      // If the response is successful, update the incomes in the state and display a success message
      const incomes = await response.json();

      if (incomes) {
        dispatch(setIncomes({ incomes }));
        setAlert("Income saved successfully.");
        setSeverity("success");
        setAlertOpen(true);
      }
    } catch (error) {
      // If the response is not successful, display an error message
      setAlert(error.message);
      setSeverity("error");
      setAlertOpen(true);
    }
  };

  /**/
  /*
  NAME

          updateIncome - a function to handle the submission of an income transaction update.

  SYNOPSIS

          updateIncome(values, onSubmitProps);
            values            --> the values from the income form.
            onSubmitProps     --> the props for the form submission.

  DESCRIPTION

          This function handles the submission of an income transaction update by sending a PATCH request to the server.
          It creates a new FormData object, appends the form values, and sends the request to the server.
          If the response is successful, it updates the income in the state and displays a success message.
          If the response is not successful, it displays an error message.

  RETURNS

          Returns a success message if the income is updated successfully, or an error message if there is an error.
  */
  /**/
  const updateIncome = async (values, onSubmitProps) => {
    // Create a new FormData object
    const formData = new FormData();

    // Append the income values to the FormData object
    formData.append("description", values.description);
    formData.append("amount", values.amount);
    formData.append("date", values.date);
    formData.append("category", values.category);

    // Send a PATCH request to the server to update the income
    const response = await fetch(
      `http://localhost:3001/transactions/income/${editRow.id}/`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    // Reset the form
    onSubmitProps.resetForm();

    try {
      // If the response is successful, update the income in the state and display a success message
      const income = await response.json();

      if (income) {
        dispatch(setIncome({ income }));
        setAlert("Income Updated successfully.");
        setSeverity("success");
        setAlertOpen(true);
        // Close the edit dialog box
        handleCloseEdit();
      }
    } catch (error) {
      // If the response is not successful, display an error message
      setAlert(error.message);
      setSeverity("error");
    }
  };

  /**/
  /*
  NAME

          updateExpense - a function to handle the submission of an expense transaction update.

  SYNOPSIS

          updateExpense(values, onSubmitProps);
            values            --> the values from the expense form.
            onSubmitProps     --> the props for the form submission.

  DESCRIPTION

          This function handles the submission of an expense transaction update by sending a PATCH request to the server.
          It creates a new FormData object, appends the form values, and sends the request to the server.
          If the response is successful, it updates the expense in the state and displays a success message.
          If the response is not successful, it displays an error message.

  RETURNS

          Returns a success message if the expense is updated successfully, or an error message if there is an error.

  */
  /**/
  const updateExpense = async (values, onSubmitProps) => {
    // Create a new FormData object
    const formData = new FormData();

    // Append the expense values to the FormData object
    formData.append("description", values.description);
    formData.append("amount", values.amount);
    formData.append("date", values.date);
    formData.append("category", values.category);

    // Send a PATCH request to the server to update the expense
    const response = await fetch(
      `http://localhost:3001/transactions/expense/${editRow.id}/`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    // Reset the form
    onSubmitProps.resetForm();

    try {
      // If the response is successful, update the expense in the state and display a success message
      const expense = await response.json();

      if (expense) {
        // Update the expense in the state
        dispatch(setExpense({ expense }));
        // Close the edit dialog box
        handleCloseEdit();
      }
    } catch (error) {
      // If the response is not successful, display an error message
      setAlert(error.message);
      setSeverity("error");
    }
  };

  /**/
  /*
  NAME

          expense - a function to handle the submission of an expense transaction.

  SYNOPSIS

          expense(values, onSubmitProps);
            values            --> the values from the expense form.
            onSubmitProps     --> the props for the form submission.

  DESCRIPTION

          This function handles the submission of an expense transaction by sending a POST request to the server.
          It creates a new FormData object, appends the form values, and sends the request to the server.
          If the response is successful, it updates the expenses in the state and displays a success message.
          If the response is not successful, it displays an error message.

  RETURNS

          Returns a success message if the expense is saved successfully, or an error message if there is an error.

  */
  /**/
  const expense = async (values, onSubmitProps) => {
    // Create a new FormData object
    const formData = new FormData();

    // Append the form values to the FormData object
    formData.append("description", values.description);
    formData.append("amount", values.amount);
    formData.append("date", values.date);
    formData.append("category", values.category);

    // Send a POST request to the server to save the expense transaction
    const response = await fetch(
      `http://localhost:3001/transactions/${_id}/expense`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    // Reset the form
    onSubmitProps.resetForm();

    try {
      // If the response is successful, update the expenses in the state and display a success message
      const expenses = await response.json();

      if (expenses) {
        dispatch(setExpenses({ expenses }));
        setAlert("Expense saved successfully.");
        setSeverity("success");
        setAlertOpen(true);
      }
    } catch (error) {
      // If the response is not successful, display an error message
      setAlert(error.message);
      setSeverity("error");
    }
  };

  /**/
  /*

  NAME

          handleFormSubmit - a function to handle the submission of the form.

  SYNOPSIS

          handleFormSubmit(values, onSubmitProps);
            values            --> the values from the form.
            onSubmitProps     --> the props for the form submission.

  DESCRIPTION

          This function handles the submission of the form by calling the corresponding function based on the page type
          and transaction type. If the page type is "add", it calls the income or expense function to save the transaction.
          If the page type is "update", it calls the updateIncome or updateExpense function to update the transaction.

  RETURNS

          No return value.

  */
  /**/
  const handleFormSubmit = async (values, onSubmitProps) => {
    // Call the corresponding function based on the page type and transaction type
    pageType === "add" &&
      (transaction === "income"
        ? income(values, onSubmitProps)
        : expense(values, onSubmitProps));
    pageType === "update" &&
      (transaction === "income"
        ? updateIncome(values, onSubmitProps)
        : updateExpense(values, onSubmitProps));
  };

  /**/
  /*
  NAME

          handleAlertClose - a function to handle the closing of the alert.

  SYNOPSIS

          handleAlertClose(event, reason);
            event            --> the event object.
            reason           --> the reason for the close event.

  DESCRIPTION

          This function handles the closing of the alert by checking the reason for the close event.
          If the reason is "clickaway", it returns. Otherwise, it closes the alert.

  RETURNS

          No return value.

  */
  /**/
  const handleAlertClose = (event, reason) => {
    // Check the reason for the close event
    if (reason === "clickaway") {
      return;
    }

    // Close the alert
    setAlertOpen(false);
  };

  return (
    <>
      <WidgetWrapper height="100%">
        <FlexBetween
          sx={{
            justifyContent: "center",
            marginBottom: "0.5rem",
          }}
        >
          <Typography
            sx={{
              fontWeight: "bolder",
              fontSize: "1rem",
            }}
          >
            {`${pageType === "add" ? "Add" : "Update"} your ${
              pageType === "add" ? "latest" : ""
            } ${transaction === "income" ? "Income" : "Expense"}!`}
          </Typography>
        </FlexBetween>
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={
            transaction === "income"
              ? initialIncomeValues
              : initialExpenseValues
          }
          validationSchema={
            transaction === "income" ? incomeSchema : expenseSchema
          }
          enableReinitialize={true}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
            setFieldValue,
          }) => (
            <form onSubmit={handleSubmit}>
              <Box
                display="grid"
                gap="30px"
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                sx={{
                  "& > div": {
                    gridColumn: isNonMobileScreens ? undefined : "span 4",
                  },
                }}
              >
                <TextField
                  label="Amount*"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.amount}
                  name="amount"
                  error={Boolean(touched.amount) && Boolean(errors.amount)}
                  helperText={touched.amount && errors.amount}
                  sx={{ gridColumn: "span 4" }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="Description"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.description}
                  name="description"
                  error={
                    Boolean(touched.description) && Boolean(errors.description)
                  }
                  helperText={touched.description && errors.description}
                  sx={{ gridColumn: "span 4" }}
                ></TextField>
                <Box sx={{ gridColumn: "span 2" }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Date*"
                      value={values.date}
                      onChange={(newValue) => {
                        setFieldValue("date", newValue);
                      }}
                      slotProps={{
                        textField: {
                          onBlur: handleBlur,
                          name: "date",
                          error: Boolean(touched.date) && Boolean(errors.date),
                          helperText: touched.date && errors.date,
                          fullWidth: true,
                        },
                      }}
                      maxDate={dayjs()}
                      minDate={dayjs("2020-01-01")}
                    />
                  </LocalizationProvider>
                </Box>
                <Box sx={{ gridColumn: "span 2" }}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Category*
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={values.category}
                      label="Category*"
                      onChange={(e) => {
                        handleChange(e);
                      }}
                      onBlur={handleBlur}
                      name="category"
                    >
                      {transaction === "income"
                        ? incomeCategories.map((category) => (
                            <MenuItem value={category} key={category}>
                              {category}
                            </MenuItem>
                          ))
                        : expenseCategories.map((category) => (
                            <MenuItem value={category} key={category}>
                              {category}
                            </MenuItem>
                          ))}
                    </Select>
                    {touched.category && errors.category && (
                      <Typography variant="caption" color="error">
                        {errors.category}
                      </Typography>
                    )}
                  </FormControl>
                </Box>

                <Button
                  fullWidth
                  type="submit"
                  sx={{
                    gridColumn: "span 4",
                    m: "2rem 0",
                    p: "1rem",
                    backgroundColor:
                      transaction === "income" ? "#4CAF50" : "#FF474C",
                    color: palette.neutral.dark,
                    "&:hover": {
                      color: palette.neutral.light,
                      backgroundColor:
                        transaction === "income" ? "#81C784" : "#FFC0CB",
                    },
                  }}
                >
                  {transaction === "income" ? <AttachMoney /> : <MoneyOff />}
                  {`${pageType === "add" ? "add" : "Update"} ${
                    transaction === "income" ? "Income" : "Expense"
                  }`}
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </WidgetWrapper>
      {alert && (
        <Alerts
          message={alert}
          severity={severity}
          open={alertOpen}
          onClose={handleAlertClose}
        />
      )}
    </>
  );
};

export default AddTransactionWidget;
