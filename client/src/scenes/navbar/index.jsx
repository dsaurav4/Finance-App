import { useEffect, useState } from "react";
import {
  Drawer,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery,
  Button,
  ButtonGroup,
  Box,
  Tooltip,
  Stack,
  Avatar,
} from "@mui/material";
import {
  DarkMode,
  LightMode,
  Menu,
  Dashboard,
  AttachMoney,
  MoneyOff,
  PieChart,
  Savings,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout } from "../../state";
import { useNavigate } from "react-router-dom";
import FlexBetween from "../../components/FlexBetween";

/**/
/*
NAME

        Navbar - A reusable Navbar component. This component is used across the application.

SYNOPSIS

        Navbar()

DESCRIPTION

        This component is used to display the Navbar at the top of the application. It includes
        various components such as the Dashboard, Income, Expense, Budget, Saving Goal, and
        Logout. The component also includes a dropdown menu for user profile. The component is
        responsive and can be used on any screen size.

RETURNS

        The Navbar component.

*/
/**/
const Navbar = () => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;

  const fullName = user ? `${user.firstName} ${user.lastName}` : "Saurav Dahal";

  // Dropdown menu for user profile
  const dropdown = (
    <FlexBetween gap="0.5rem">
      <FormControl variant="standard" value={fullName}>
        <Select
          value={fullName}
          sx={{
            backgroundColor: neutralLight,
            width: "150px",
            borderRadius: "0.25rem",
            p: "0.25rem 1rem",
            "& .MuiSvgIcon-root": {
              pr: "0.25rem",
              width: "3rem",
            },
            "& .MuiSelect-select:focus": {
              backgroundColor: neutralLight,
            },
          }}
          input={<InputBase />}
        >
          <MenuItem value={fullName}>
            <Typography>{fullName}</Typography>
          </MenuItem>
          <MenuItem onClick={() => dispatch(setLogout())}>Log Out</MenuItem>
        </Select>
      </FormControl>
      {user.picturePath && (
        <Stack direction="row">
          <Avatar alt="user Image" src={user.picturePath} />
        </Stack>
      )}
    </FlexBetween>
  );

  useEffect(() => setIsMobileMenuToggled(false), [isNonMobileScreens]);

  return (
    <FlexBetween padding="1rem 6%" backgroundColor={alt}>
      {/* NAVIGATION MENU */}
      <FlexBetween gap="1.75rem">
        <Typography
          fontWeight="bold"
          fontSize="clamp(1rem, 2rem, 2.25rem)"
          color="inherit"
          onClick={() => navigate("/dashboard")}
          sx={{
            "&:hover": {
              color:
                theme.palette.mode === "dark" ? neutralLight : primaryLight,
              cursor: "pointer",
            },
          }}
        >
          FINANCE
        </Typography>
      </FlexBetween>

      {/* DESKTOP NAV */}
      {isNonMobileScreens ? (
        <FlexBetween gap="2rem">
          <Tooltip title="Dashboard" arrow>
            <IconButton onClick={() => navigate("/dashboard")} color="inherit">
              <Dashboard sx={{ fontSize: "25px" }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Income" arrow>
            <IconButton onClick={() => navigate("/income")} color="inherit">
              <AttachMoney sx={{ fontSize: "25px" }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Expense" arrow>
            <IconButton onClick={() => navigate("/expense")} color="inherit">
              <MoneyOff sx={{ fontSize: "25px" }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Budget" arrow>
            <IconButton onClick={() => navigate("/budget")} color="inherit">
              <PieChart sx={{ fontSize: "25px" }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Saving Goal" arrow>
            <IconButton onClick={() => navigate("/savingGoal")} color="inherit">
              <Savings sx={{ fontSize: "25px" }} />
            </IconButton>
          </Tooltip>
          <Tooltip
            title={theme.palette.mode === "dark" ? "Light Mode" : "Dark Mode"}
            arrow
          >
            <IconButton onClick={() => dispatch(setMode())} color="inherit">
              {theme.palette.mode === "light" ? (
                <DarkMode sx={{ fontSize: "25px" }} />
              ) : (
                <LightMode sx={{ fontSize: "25px" }} />
              )}
            </IconButton>
          </Tooltip>
          {dropdown}
        </FlexBetween>
      ) : (
        <FlexBetween>
          {dropdown}
          <IconButton
            onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
          >
            <Menu />
          </IconButton>
        </FlexBetween>
      )}

      {/* MOBILE NAV */}
      {!isNonMobileScreens && isMobileMenuToggled && (
        <Drawer
          open={isMobileMenuToggled}
          anchor="right"
          onClose={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
          PaperProps={{
            sx: {
              backgroundColor: alt,
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              "& > *": {
                m: 1,
              },
              backgroundColor: alt,
              height: "100%",
              width: 250,
            }}
            role="presentation"
          >
            <ButtonGroup
              orientation="vertical"
              aria-label="vertical button group"
              fullWidth
              color="inherit"
              variant="text"
            >
              {/* DASHBOARD */}
              <Button
                sx={{ color: "inherit" }}
                onClick={() => navigate("/dashboard")}
              >
                <FlexBetween gap="1rem">
                  <Dashboard sx={{ fontSize: "25px" }} />
                  <Typography
                    fontWeight="bold"
                    fontSize="clamp(0.75rem, 1.2rem, 1.75rem)"
                  >
                    Dashboard
                  </Typography>
                </FlexBetween>
              </Button>

              {/* INCOME */}
              <Button
                sx={{ color: "inherit" }}
                onClick={() => navigate("/income")}
              >
                <FlexBetween gap="1rem">
                  <AttachMoney sx={{ fontSize: "25px" }} />
                  <Typography
                    fontWeight="bold"
                    fontSize="clamp(0.75rem, 1.2rem, 1.75rem)"
                  >
                    Income
                  </Typography>
                </FlexBetween>
              </Button>

              {/* EXPENSE */}
              <Button
                sx={{ color: "inherit" }}
                onClick={() => navigate("/expense")}
              >
                <FlexBetween gap="1rem">
                  <MoneyOff sx={{ fontSize: "25px" }} />
                  <Typography
                    fontWeight="bold"
                    fontSize="clamp(0.75rem, 1.2rem, 1.75rem)"
                  >
                    Expense
                  </Typography>
                </FlexBetween>
              </Button>

              {/* BUDGET */}
              <Button
                sx={{ color: "inherit" }}
                onClick={() => navigate("/budget")}
              >
                <FlexBetween gap="1rem">
                  <PieChart sx={{ fontSize: "25px" }} />
                  <Typography
                    fontWeight="bold"
                    fontSize="clamp(0.75rem, 1.2rem, 1.75rem)"
                  >
                    Budget
                  </Typography>
                </FlexBetween>
              </Button>

              {/* SAVING GOALS */}
              <Button
                sx={{ color: "inherit" }}
                onClick={() => navigate("/savingGoals")}
              >
                <FlexBetween gap="1rem">
                  <Savings sx={{ fontSize: "25px" }} />
                  <Typography
                    fontWeight="bold"
                    fontSize="clamp(0.75rem, 1.2rem, 1.75rem)"
                  >
                    Saving Goals
                  </Typography>
                </FlexBetween>
              </Button>

              {/* MODE */}
              <Button
                onClick={() => dispatch(setMode())}
                sx={{ color: "inherit" }}
              >
                <FlexBetween gap="1rem">
                  {theme.palette.mode === "light" ? (
                    <DarkMode sx={{ fontSize: "25px" }} />
                  ) : (
                    <LightMode sx={{ fontSize: "25px" }} />
                  )}
                  <Typography
                    fontWeight="bold"
                    fontSize="clamp(0.75rem, 1.2rem, 1.75rem)"
                  >
                    {theme.palette.mode === "dark" ? "Light Mode" : "Dark Mode"}
                  </Typography>
                </FlexBetween>
              </Button>
            </ButtonGroup>
          </Box>
        </Drawer>
      )}
    </FlexBetween>
  );
};

export default Navbar;
