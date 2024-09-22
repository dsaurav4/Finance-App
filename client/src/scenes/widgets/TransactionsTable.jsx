import { DataGrid } from "@mui/x-data-grid";
import WidgetWrapper from "../../components/WidgetWrapper";
import {
  AccountBalanceWallet,
  CardGiftcard,
  Business,
  Work,
  TrendingUp,
  Category,
  House,
  Fastfood,
  LocalGroceryStore,
  TheaterComedy,
  FlightTakeoff,
  MedicalInformation,
  School,
  DynamicForm,
  Edit,
  Delete,
} from "@mui/icons-material";
import { Paper, Typography, IconButton } from "@mui/material";
import FlexBetween from "../../components/FlexBetween";
import { useSelector, useDispatch } from "react-redux";
import { setIncomes, setExpenses, setIncome, setExpense } from "../../state";
import { useState } from "react";
import DeleteDialogBox from "../../components/DeleteDialogBox.jsx";
import Alerts from "../../components/Alerts.jsx";
import EditDialogBox from "../../components/EditDialogBox.jsx";

/**/
/*
NAME

        TransactionTable - A react functional component that displays a table of income or expense transactions.

SYNOPSIS

        TransactionTable({ type, transactions })
                type --> The type of transactions (income or expense).
                transactions --> An array of transaction objects.

DESCRIPTION

        The TransactionTable component displays a table of income or expense transactions. 
        The component takes in the type of transactions (income or expense) and an array of transaction objects as props.
        The component categorizes the transactions by type and assigns a color to each category based on the transaction type.
        The component also provides functionality to edit and delete transactions.

RETURNS

        Returns the JSX elements to display a table of income or expense transactions.

*/
/**/
const TransactionTable = ({ type, transactions }) => {
  // Green color for income transactions
  const incomeColor = "#4CAF50";
  // Red color for expense transactions
  const expenseColor = "#FF474C";

  // Categories for income transactions
  const incomeCategories = {
    Salary: <AccountBalanceWallet />,
    Gifts: <CardGiftcard />,
    Business: <Business />,
    Freelance: <Work />,
    Investments: <TrendingUp />,
  };

  // Categories for expense transactions
  const expenseCategories = {
    Rent: <House />,
    Utilities: <DynamicForm />,
    Food: <Fastfood />,
    Groceries: <LocalGroceryStore />,
    Entertainment: <TheaterComedy />,
    Travel: <FlightTakeoff />,
    Healthcare: <MedicalInformation />,
    Education: <School />,
    Other: <Category />,
  };

  // The categories for the current type of transactions
  const categories = type === "income" ? incomeCategories : expenseCategories;

  // The row currently being edited or deleted
  const [row, setRow] = useState({});
  // The alert message to be displayed
  const [alert, setAlert] = useState("");
  // The severity of the alert (error, warning, info, success)
  const [severity, setSeverity] = useState("error");
  // Whether the alert is open or not
  const [alertOpen, setAlertOpen] = useState(false);

  /**/
  /*

  NAME

          handleAlertClose - A function that handles the closing of the alert message.

  SYNOPSIS

          handleAlertClose(event, reason)
                  event --> The event object.
                  reason --> The reason for closing the alert message.

  DESCRIPTION

          The handleAlertClose function handles the closing of the alert message.

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

  // The columns to be displayed in the DataGrid component
  const columns = [
    {
      field: "description",
      headerName: "Description",
      width: 200,
      resizable: false,
      hideable: false,
    },
    {
      field: "category",
      headerName: "Category",
      width: 150,
      renderCell: (params) => {
        const category = params.value;
        const icon = categories[category] || <Category />;
        const text = category;
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginTop: "1rem",
            }}
          >
            {icon}
            <Typography variant="body2">{text}</Typography>
          </div>
        );
      },
      resizable: false,
      hideable: false,
    },
    {
      field: "amount",
      headerName: "Amount",
      type: "number",
      width: 100,
      headerAlign: "left",
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            fontWeight: "bold",
            color: type === "income" ? incomeColor : expenseColor,
          }}
          marginTop="1rem"
          display="flex"
        >
          ${params.value}
        </Typography>
      ),
      resizable: false,
      hideable: false,
    },
    {
      field: "date",
      headerName: "Date",
      width: 150,
      resizable: false,
      hideable: false,
    },
    {
      field: "editAndDelete",
      headerName: "",
      width: 100,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleClickOpenEdit(params.row)}>
            <Edit />
          </IconButton>
          <IconButton onClick={() => handleClickOpenDelete(params.row)}>
            <Delete />
          </IconButton>
        </>
      ),
      resizable: false,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      hideable: false,
    },
  ];

  // The rows to be displayed in the DataGrid component
  const rows = transactions.map((item) => ({
    id: item._id,
    description: item.description,
    amount: item.amount,
    date: new Date(item.date).toLocaleDateString(),
    category: item.category,
  }));

  // Sort the rows in descending order based on the date
  const sortedRows = rows.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Get the user ID and token from the state
  const userId = useSelector((state) => state.user._id);
  // The user's ID and token, retrieved from the state
  const token = useSelector((state) => state.token);
  // The dispatch function for updating the state
  const dispatch = useDispatch();

  /**/
  /*

  NAME

          handleDelete - A function that handles the deletion of a transaction.

  SYNOPSIS

          handleDelete(row, type)
                  row --> The transaction row to be deleted.
                  type --> The type of transaction (income or expense).

  DESCRIPTION

          The handleDelete function handles the deletion of a transaction.
          The function sends a DELETE request to the server to delete the transaction.

  RETURNS

          No return value.

  */
  /**/
  const handleDelete = async (row, type) => {
    // Delete a transaction by sending a DELETE request to the server
    try {
      if (type === "income") {
        // Delete income transaction
        const response = await fetch(
          `http://localhost:3001/transactions/${userId}/income/${row.id}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();
        dispatch(setIncomes({ incomes: data }));
        setAlert("Income deleted successfully.");
        setSeverity("success");
        setAlertOpen(true);
      } else {
        // Delete expense transaction
        const response = await fetch(
          `http://localhost:3001/transactions/${userId}/expense/${row.id}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();
        dispatch(setExpenses({ expenses: data }));
        setAlert("Expense deleted successfully.");
        setSeverity("success");
        setAlertOpen(true);
      }
      handleCloseDelete();
    } catch (error) {
      setAlert(error.message);
      setSeverity("error");
      setAlertOpen(true);
      handleCloseDelete();
    }
  };

  // Whether the delete dialog box is open or not
  const [openDelete, setOpenDelete] = useState(false);

  /**/
  /*
  NAME

          handleClickOpenDelete - A function that opens the delete dialog box and sets the row to be deleted.

  SYNOPSIS

          handleClickOpenDelete(row)
                  row --> The transaction row to be deleted.

  DESCRIPTION

          The handleClickOpenDelete function opens the delete dialog box and sets the row to be deleted.

  RETURNS

          No return value.

  */
  /**/
  const handleClickOpenDelete = (row) => {
    setOpenDelete(true);
    setRow(row);
  };

  /**/
  /*

  NAME

          handleCloseDelete - A function that closes the delete dialog box.

  SYNOPSIS

          handleCloseDelete()

  DESCRIPTION

          The handleCloseDelete function closes the delete dialog box by resetting its open state and the row data.

  RETURNS

          No return value.

  */
  /**/
  const handleCloseDelete = () => {
    setOpenDelete(false);
    setRow({});
  };

  // Whether the edit dialog box is open or not
  const [openEdit, setOpenEdit] = useState(false);

  /**/
  /*

  NAME

          handleClickOpenEdit - A function that opens the edit dialog box and sets the row to be edited.

  SYNOPSIS

          handleClickOpenEdit(row)
                  row --> The transaction row to be edited.

  DESCRIPTION

          The handleClickOpenEdit function opens the edit dialog box and sets the row to be edited.

  RETURNS

          No return value.

  */
  /**/
  const handleClickOpenEdit = (row) => {
    setOpenEdit(true);
    setRow(row);
  };

  /**/
  /*
  NAME

          handleCloseEdit - A function that closes the edit dialog box.

  SYNOPSIS

          handleCloseEdit()

  DESCRIPTION

          The handleCloseEdit function closes the edit dialog box by resetting its open state and the row data.

  RETURNS

          No return value.

  */
  /**/
  const handleCloseEdit = () => {
    setOpenEdit(false);
    setRow({});
  };

  return (
    <WidgetWrapper sx={{ minWidth: 0 }}>
      <FlexBetween sx={{ justifyContent: "center", width: "75%%" }}>
        <Typography variant="h6">{`Latest ${
          type === "income" ? "Incomes" : "Expenses"
        }`}</Typography>
      </FlexBetween>
      <Paper sx={{ height: 325, overflow: "hidden" }} width="100%">
        <DataGrid
          rows={sortedRows}
          columns={columns}
          pageSize={10}
          pageSizeOptions={[5, 10, 25, 50, 100]}
          sx={{ "&, [class^=MuiDataGrid]": { border: "none" } }}
          width="100%"
        />
      </Paper>
      <DeleteDialogBox
        open={openDelete}
        handleClose={handleCloseDelete}
        handleDelete={handleDelete}
        row={row}
        type={type}
      />
      <EditDialogBox
        open={openEdit}
        handleClose={handleCloseEdit}
        row={row}
        type={type}
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

export default TransactionTable;
