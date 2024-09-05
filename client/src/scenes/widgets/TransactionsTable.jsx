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

const TransactionTable = ({ type, transactions }) => {
  const incomeColor = "#4CAF50";
  const expenseColor = "#FF474C";

  const incomeCategories = {
    Salary: <AccountBalanceWallet />,
    Gifts: <CardGiftcard />,
    Business: <Business />,
    Freelance: <Work />,
    Investments: <TrendingUp />,
  };

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

  const categories = type === "income" ? incomeCategories : expenseCategories;

  const [row, setRow] = useState({});
  const [alert, setAlert] = useState("");
  const [severity, setSeverity] = useState("error");
  const [alertOpen, setAlertOpen] = useState(false);
  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertOpen(false);
  };

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

  const rows = transactions.map((item) => ({
    id: item._id,
    description: item.description,
    amount: item.amount,
    date: new Date(item.date).toLocaleDateString(),
    category: item.category,
  }));

  const sortedRows = rows.sort((a, b) => new Date(b.date) - new Date(a.date));

  const userId = useSelector((state) => state.user._id);
  const token = useSelector((state) => state.token);
  const dispatch = useDispatch();

  const handleDelete = async (row, type) => {
    try {
      if (type === "income") {
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

  const [openDelete, setOpenDelete] = useState(false);

  const handleClickOpenDelete = (row) => {
    setOpenDelete(true);
    setRow(row);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
    setRow({});
  };

  const [openEdit, setOpenEdit] = useState(false);

  const handleClickOpenEdit = (row) => {
    setOpenEdit(true);
    setRow(row);
  };

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
      <Paper sx={{ height: 325 }} width="100%">
        <DataGrid
          rows={sortedRows}
          columns={columns}
          pageSize={10}
          pageSizeOptions={[5, 10, 25, 50, 100]}
          sx={{ border: 0, overflowX: "scroll" }}
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
