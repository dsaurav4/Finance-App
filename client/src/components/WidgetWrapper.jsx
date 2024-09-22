import { Box } from "@mui/material";
import { styled } from "@mui/system";

/**/
/*
NAME  

  WidgetWrapper - A styled component that wraps other components in a box with
  padding, background color, border radius, and a box shadow.

SYNOPSIS
  WidgetWrapper({ children, ...otherProps })
    children --> The content of the component.
    otherProps --> The other props to be passed to the component.

DESCRIPTION
  A styled component that wraps other components in a box with padding, background
  color, border radius, and a box shadow. It is used to create a container with
  padding, background color, border radius, and a box shadow.

RETURNS
  The WidgetWrapper component.
*/
const WidgetWrapper = styled(Box)(({ theme }) => ({
  padding: "1.5rem 1.5rem 0.75rem 1.5rem",
  backgroundColor: theme.palette.background.alt,
  borderRadius: "0.75rem",
  boxShadow: theme.shadows[24],
  border: `1px solid ${
    theme.palette.mode === "light"
      ? theme.palette.grey[300]
      : theme.palette.grey[800]
  }`,
}));

export default WidgetWrapper;
