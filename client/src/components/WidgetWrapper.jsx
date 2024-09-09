import { Box } from "@mui/material";
import { styled } from "@mui/system";

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
