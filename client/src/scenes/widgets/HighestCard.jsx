import WidgetWrapper from "../../components/WidgetWrapper";
import FlexBetween from "../../components/FlexBetween";
import { Typography, Box, useTheme } from "@mui/material";
import ArrowDropUpSharpIcon from "@mui/icons-material/ArrowDropUpSharp";
import ArrowDropDownSharpIcon from "@mui/icons-material/ArrowDropDownSharp";
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

/**/
/*
NAME

        HighestCard - A react functional component that displays the highest income or expense transaction.

SYNOPSIS

        HighestCard({ amount, headerMessage, type, description, category })
                amount --> The amount of the transaction.
                headerMessage --> The header message for the highest card component.
                type --> The type of transaction (income or expense).
                description --> The description of the transaction.
                category --> The category of the transaction.

DESCRIPTION

        The HighestCard component displays the highest income or expense transaction.
        The component takes in the amount, header message, type, description, and category of the transaction as props.
        The component displays the amount, description, and category of the transaction along with an icon based on the 
        category of the transaction. The component also displays an arrow icon pointing up for income transactions and down 
        for expense transactions. The color of the arrow icon is green for income transactions and red for expense transactions.

RETURNS

        Returns the JSX elements to display the highest income or expense transaction.

*/
/**/
const HighestCard = ({
  amount,
  headerMessage,
  type,
  description,
  category,
}) => {
  // Green color for income transactions
  const incomeColor = "#4CAF50";
  // Red color for expense transactions
  const expenseColor = "#FF474C";

  // Styling for the icons used in the highest card component
  const iconStyle = {
    fontSize: "3rem",
    color: type === "income" ? incomeColor : expenseColor,
  };

  // Categories for income transactions
  const incomeCategories = {
    Salary: <AccountBalanceWallet sx={iconStyle} />,
    Gifts: <CardGiftcard sx={iconStyle} />,
    Business: <Business sx={iconStyle} />,
    Freelance: <Work sx={iconStyle} />,
    Investments: <TrendingUp sx={iconStyle} />,
  };

  // Categories for expense transactions
  const expenseCategories = {
    Rent: <House sx={iconStyle} />,
    Utilities: <DynamicForm sx={iconStyle} />,
    Food: <Fastfood sx={iconStyle} />,
    Groceries: <LocalGroceryStore sx={iconStyle} />,
    Entertainment: <TheaterComedy sx={iconStyle} />,
    Travel: <FlightTakeoff sx={iconStyle} />,
    Healthcare: <MedicalInformation sx={iconStyle} />,
    Education: <School sx={iconStyle} />,
    Other: <Category sx={iconStyle} />,
  };

  // Get the categories based on the transaction type
  // The categories are used to display the appropriate icon for the transaction
  const categories = type === "income" ? incomeCategories : expenseCategories;

  // Get the theme palette
  // The palette is used to get the colors for the highest card component
  const { palette } = useTheme();

  return (
    <WidgetWrapper
      sx={{
        paddingTop: "2rem",
        paddingX: "1.5rem",
        borderRadius: "20px",
      }}
      width="100%"
    >
      <Typography
        variant="h6"
        sx={{
          fontSize: "1rem",
          color: palette.neutral.dark,
        }}
      >
        {headerMessage}
      </Typography>
      <Box
        sx={{
          display: "flex",
          gap: "2rem",
          alignItems: "center",
          padding: "1rem",
        }}
      >
        <FlexBetween
          sx={{
            alignItems: "center",
            justifyContent: "flex-start",
            gap: "16px",
            padding: "1rem",
            borderRadius: "8px",
          }}
        >
          {type === "income" ? (
            <ArrowDropUpSharpIcon
              sx={{
                color: type === "income" ? incomeColor : expenseColor,
                height: "2.5rem",
                width: "2.5rem",
              }}
            />
          ) : (
            <ArrowDropDownSharpIcon
              sx={{
                color: type === "income" ? incomeColor : expenseColor,
                height: "2.5rem",
                width: "2.5rem",
              }}
            ></ArrowDropDownSharpIcon>
          )}
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontSize: "2rem",
                fontWeight: "900",
                color: type === "income" ? incomeColor : expenseColor,
              }}
            >
              {`$${amount}`}
            </Typography>
            <Typography
              sx={{
                color: palette.neutral.main,
              }}
            >
              {description}
            </Typography>
          </Box>
        </FlexBetween>
        <Box>{categories[category]}</Box>
      </Box>
    </WidgetWrapper>
  );
};
export default HighestCard;
