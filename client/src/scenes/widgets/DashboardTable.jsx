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
} from "@mui/icons-material";
import { Paper, Typography, useMediaQuery } from "@mui/material";
import FlexBetween from "../../components/FlexBetween";
import { useSelector } from "react-redux";
import { useState } from "react";

const DashboardTransactionTable = () => {
  const incomeColor = "#4CAF50";
  const expenseColor = "#FF474C";

  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

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

  const incomes = useSelector((state) => state.incomes);
  const expenses = useSelector((state) => state.expenses);

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
        const type = params.row.type;
        const categories =
          type === "income" ? incomeCategories : expenseCategories;
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
      width: 200,
      headerAlign: "center",
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            fontWeight: "bold",
            color: params.row.type === "income" ? incomeColor : expenseColor,
            width: "100%",
            textAlign: "center",
          }}
          marginTop="1rem"
          display="flex"
          justifyContent="center"
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
      headerAlign: "center",
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            width: "100%",
            textAlign: "center",
          }}
          display="flex"
          justifyContent="center"
          marginTop="1rem"
        >
          {params.value}
        </Typography>
      ),
    },
  ];

  const transactions = [
    ...incomes.map((item) => ({ ...item, type: "income" })),
    ...expenses.map((item) => ({ ...item, type: "expense" })),
  ];

  const rows = transactions.map((item) => ({
    id: item._id,
    description: item.description,
    amount: item.amount,
    date: new Date(item.date).toLocaleDateString(),
    category: item.category,
    type: item.type,
  }));

  const sortedRows = rows.sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <WidgetWrapper
      sx={{ minWidth: 0 }}
      height={`${isNonMobileScreens ? "100%" : undefined}`}
    >
      <FlexBetween sx={{ justifyContent: "center", width: "100%" }}>
        <Typography variant="h6">Latest Transactions</Typography>
      </FlexBetween>
      <Paper
        sx={{ height: 450, overflow: "hidden", marginY: "1rem" }}
        width="100%"
      >
        <DataGrid
          rows={sortedRows}
          columns={columns}
          pageSize={10}
          pageSizeOptions={[5, 10, 25, 50, 100]}
          sx={{ "&, [class^=MuiDataGrid]": { border: "none" } }}
          width="100%"
        />
      </Paper>
    </WidgetWrapper>
  );
};

export default DashboardTransactionTable;
