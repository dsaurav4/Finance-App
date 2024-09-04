import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import LoginPage from "./scenes/loginPage";
import Dashboard from "./scenes/dashboard";
import Income from "./scenes/income";
import Expense from "./scenes/expense";

function App() {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state) => state.token));

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route
              path="/dashboard"
              element={isAuth ? <Dashboard /> : <Navigate to="/" />}
            />
            <Route
              path="/income"
              element={isAuth ? <Income /> : <Navigate to="/" />}
            />
            <Route
              path="/expense"
              element={isAuth ? <Expense /> : <Navigate to="/" />}
            />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
