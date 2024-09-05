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
  InputBase,
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

const AddTransactionWidget = ({
  transaction,
  pageType,
  editRow,
  handleCloseEdit,
}) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const [alert, setAlert] = useState("");
  const [severity, setSeverity] = useState("error");
  const [alertOpen, setAlertOpen] = useState(false);

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

  const incomeCategories = [
    "Salary",
    "Freelance",
    "Investments",
    "Gifts",
    "Business",
    "Other",
  ];

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

  const income = async (values, onSubmitProps) => {
    const formData = new FormData();

    formData.append("description", values.description);
    formData.append("amount", values.amount);
    formData.append("date", values.date);
    formData.append("category", values.category);

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

    onSubmitProps.resetForm();
    try {
      const incomes = await response.json();

      if (incomes) {
        dispatch(setIncomes({ incomes }));
        setAlert("Income saved successfully.");
        setSeverity("success");
        setAlertOpen(true);
      }
    } catch (error) {
      setAlert(error.message);
      setSeverity("error");
      setAlertOpen(true);
    }
  };

  const updateIncome = async (values, onSubmitProps) => {
    const formData = new FormData();

    formData.append("description", values.description);
    formData.append("amount", values.amount);
    formData.append("date", values.date);
    formData.append("category", values.category);

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

    onSubmitProps.resetForm();

    try {
      const income = await response.json();

      if (income) {
        dispatch(setIncome({ income }));
        setAlert("Income Updated successfully.");
        setSeverity("success");
        setAlertOpen(true);
        handleCloseEdit();
      }
    } catch (error) {
      setAlert(error.message);
      setSeverity("error");
    }
  };

  const updateExpense = async (values, onSubmitProps) => {
    const formData = new FormData();

    formData.append("description", values.description);
    formData.append("amount", values.amount);
    formData.append("date", values.date);
    formData.append("category", values.category);

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

    onSubmitProps.resetForm();

    try {
      const expense = await response.json();

      if (expense) {
        dispatch(setExpense({ expense }));
        handleCloseEdit();
      }
    } catch (error) {
      setAlert(error.message);
      setSeverity("error");
    }
  };

  const expense = async (values, onSubmitProps) => {
    const formData = new FormData();

    formData.append("description", values.description);
    formData.append("amount", values.amount);
    formData.append("date", values.date);
    formData.append("category", values.category);

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

    onSubmitProps.resetForm();

    try {
      const expenses = await response.json();

      if (expenses) {
        dispatch(setExpenses({ expenses }));
        setAlert("Expense saved successfully.");
        setSeverity("success");
        setAlertOpen(true);
      }
    } catch (error) {
      setAlert(error.message);
      setSeverity("error");
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    pageType === "add" &&
      (transaction === "income"
        ? income(values, onSubmitProps)
        : expense(values, onSubmitProps));
    pageType === "update" &&
      (transaction === "income"
        ? updateIncome(values, onSubmitProps)
        : updateExpense(values, onSubmitProps));
  };

  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertOpen(false);
  };

  return (
    <>
      <WidgetWrapper>
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
                  <FormControl variant="standard" fullWidth>
                    <Select
                      value={values.category}
                      onChange={(e) => {
                        handleChange(e);
                      }}
                      onBlur={handleBlur}
                      name="category"
                      sx={{
                        backgroundColor: palette.neutral.light,
                        borderRadius: "0.25rem",
                        p: "0.25rem 1rem",
                        "& .MuiSvgIcon-root": {
                          pr: "0.25rem",
                          width: "3rem",
                        },
                        "& .MuiSelect-select:focus": {
                          backgroundColor: palette.neutral.light,
                        },
                      }}
                      input={<InputBase />}
                    >
                      <MenuItem value="" disabled>
                        Select Category
                      </MenuItem>
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
                  <Typography
                    sx={{ marginTop: "0.5rem", color: palette.neutral.dark }}
                  >
                    Category*
                  </Typography>
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
