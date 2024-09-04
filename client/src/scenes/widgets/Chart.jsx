import { BarChart } from "@mui/x-charts/BarChart";
import WidgetWrapper from "../../components/WidgetWrapper";
import { format, eachMonthOfInterval, parseISO } from "date-fns";
import { Button, Menu, MenuItem, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import FlexBetween from "../../components/FlexBetween";

const Chart = ({ transactions, transactionsType, year, setYear }) => {
  const dataset = aggregateTransactionsByMonth(transactions, year);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { palette } = useTheme();

  const currentYear = new Date().getFullYear();
  const years = [];

  for (let year = 2020; year <= currentYear; year++) {
    years.push(year);
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleYearSelect = (year) => {
    setYear(year);
    handleClose();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <WidgetWrapper>
      <Button
        id="year-button"
        aria-controls={open ? "year-menu" : undefined}
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
        {year}
      </Button>
      <Menu
        id="year-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "year-button",
        }}
      >
        {years.map((year) => (
          <MenuItem key={year} onClick={() => handleYearSelect(year)}>
            {year}
          </MenuItem>
        ))}
      </Menu>

      <BarChart
        dataset={dataset}
        xAxis={[
          {
            scaleType: "band",
            dataKey: "month",
          },
        ]}
        yAxis={[{ scaleType: "linear", dataKey: "totalAmount" }]}
        series={[
          {
            dataKey: "totalAmount",
            label: `Total ${
              transactionsType === "income" ? "Income" : "Expense"
            }`,
            color: transactionsType === "income" ? "#4CAF50" : "#FF474C",
          },
        ]}
        layout="vertical"
        height={300}
        borderRadius={10}
      />
      <FlexBetween
        sx={{ justifyContent: "center", width: "100%", padding: "1.5rem" }}
      >
        {dataset.length > 0 &&
        dataset.every((monthData) => monthData.totalAmount === 0) ? (
          <Typography>No transactions recorded for this year.</Typography>
        ) : (
          <Typography variant="h6">
            {`Total ${
              transactionsType === "income" ? "Income" : "Expense"
            } Each Month for ${year}`}
          </Typography>
        )}
      </FlexBetween>
    </WidgetWrapper>
  );
};

export default Chart;

const aggregateTransactionsByMonth = (transactions, year) => {
  const startDate = new Date(Date.UTC(year, 0, 1)); // January 1st of the year in UTC
  const endDate = new Date(Date.UTC(year, 11, 31)); // December 31st of the year in UTC

  const allMonths = eachMonthOfInterval({
    start: startDate,
    end: endDate,
  }).map((date) => format(date, "MMM yyyy"));

  const transactionsByMonth = transactions.reduce((acc, transaction) => {
    // Parse the date string into a Date object using parseISO
    const transactionDate = parseISO(transaction.date);
    const transactionYear = transactionDate.getUTCFullYear();

    if (transactionYear === year) {
      const month = format(transactionDate, "MMM yyyy", { timeZone: "UTC" }); // Use UTC to avoid timezone issues
      if (!acc[month]) {
        acc[month] = 0;
      }
      acc[month] += transaction.amount;
    }

    return acc;
  }, {});

  return allMonths.map((month) => ({
    month,
    totalAmount: transactionsByMonth[month] || 0,
  }));
};
