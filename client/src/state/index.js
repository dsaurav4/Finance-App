import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  user: null,
  token: null,
  incomes: [],
  expenses: [],
  budgets: [],
  savingGoals: [],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
    setIncomes: (state, action) => {
      state.incomes = action.payload.incomes;
    },
    setIncome: (state, action) => {
      const updatedIncomes = state.incomes.map((income) => {
        if (income._id === action.payload.income._id)
          return action.payload.income;
        return income;
      });
      state.incomes = updatedIncomes;
    },
    setExpenses: (state, action) => {
      state.expenses = action.payload.expenses;
    },
    setExpense: (state, action) => {
      const updatedExpenses = state.expenses.map((expense) => {
        if (expense._id === action.payload.expense._id)
          return action.payload.expense;
        return expense;
      });
      state.expenses = updatedExpenses;
    },
    setBudgets: (state, action) => {
      state.budgets = action.payload.budgets;
    },
    setBudget: (state, action) => {
      const updatedBudgets = state.budgets.map((budget) => {
        if (budget._id === action.payload.budget._id)
          return action.payload.budget;
        return budget;
      });
      state.budgets = updatedBudgets;
    },
    setSavingGoals: (state, action) => {
      state.savingGoals = action.payload.savingGoals;
    },
    setSavingGoal: (state, action) => {
      const updatedSavingGoals = state.savingGoals.map((savingGoal) => {
        if (savingGoal._id === action.payload.savingGoal._id)
          return action.payload.savingGoal;
        return savingGoal;
      });
      state.savingGoals = updatedSavingGoals;
    },
  },
});

export const {
  setMode,
  setLogin,
  setLogout,
  setIncomes,
  setIncome,
  setExpenses,
  setExpense,
  setBudgets,
  setBudget,
  setSavingGoals,
  setSavingGoal,
} = authSlice.actions;

export default authSlice.reducer;
