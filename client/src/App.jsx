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
import Budget from "./scenes/budget";
import SavingGoals from "./scenes/savingGoals";
import Reset from "./scenes/reset";

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
            <Route
              path="/budget"
              element={isAuth ? <Budget /> : <Navigate to="/" />}
            />
            <Route
              path="/savingGoal"
              element={isAuth ? <SavingGoals /> : <Navigate to="/" />}
            />
            <Route path="/reset/:userId" element={<Reset />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
