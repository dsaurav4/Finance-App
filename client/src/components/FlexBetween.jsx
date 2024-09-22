import { Box } from "@mui/material";
import { styled } from "@mui/system";

/**/
/*
NAME

  FlexBetween - A component that renders a box with flex properties.

SYNOPSIS  
  FlexBetween({ children, ...otherProps })
    children --> The content of the component.
    otherProps --> The other props to be passed to the component.     

DESCRIPTION
  A component that renders a box with flex properties. It is used to create a
  flex container with flex properties.

RETURNS
  The FlexBetween component.
*/
/**/
const FlexBetween = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

export default FlexBetween;
