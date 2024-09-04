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

const HighestCard = ({
  amount,
  headerMessage,
  type,
  description,
  category,
}) => {
  const incomeColor = "#4CAF50";
  const expenseColor = "#FF474C";

  const iconStyle = {
    fontSize: "3rem",
    color: type === "income" ? incomeColor : expenseColor,
  };

  const incomeCategories = {
    Salary: <AccountBalanceWallet sx={iconStyle} />,
    Gifts: <CardGiftcard sx={iconStyle} />,
    Business: <Business sx={iconStyle} />,
    Freelance: <Work sx={iconStyle} />,
    Investments: <TrendingUp sx={iconStyle} />,
  };

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

  const categories = type === "income" ? incomeCategories : expenseCategories;

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
