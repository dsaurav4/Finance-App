import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import Form from "./Form";
import { useState } from "react";

/**/
/*
NAME
        LoginPage - The login page component.


SYNOPSIS
        LoginPage()


DESCRIPTION
        The login page component is a React component that displays the login page
        with a form for logging in or registering a new user. It also includes a
        forgot password link that allows users to reset their password if they
        forget it.

RETURNS
        No return value.
*/
/**/
const LoginPage = () => {
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const [pageType, setPageType] = useState("login");

  return (
    <Box sx={{ paddingBottom: "3rem" }}>
      {/* Container for the welcome message and the form */}
      <Box
        width="100%"
        backgroundColor={theme.palette.background.alt}
        p="1rem 6%"
        textAlign="center"
      >
        <Typography fontWeight="bold" fontSize="32px" color="inherit">
          FINANCE
        </Typography>
      </Box>

      {/* Container for the form */}
      <Box
        width={isNonMobileScreens ? "50%" : "93%"}
        p="2rem"
        m="2rem auto"
        borderRadius="1.5rem"
        backgroundColor={theme.palette.background.alt}
      >
        {/* Message based on the current page type */}
        <Typography fontWeight="500" variant="h5" sx={{ mb: "1.5rem" }}>
          {pageType != "forgotPassword"
            ? "Welcome to The Finance App!"
            : "Send a code to reset your password"}
        </Typography>
        {/* The form component based on the current page type */}
        <Form pageType={pageType} setPageType={setPageType} />
      </Box>
    </Box>
  );
};

export default LoginPage;
