import { createSlice } from "@reduxjs/toolkit";

// the initial state of the application
const initialState = {
  // the application mode (light or dark)
  mode: "light",
  // the user object
  user: null,
  // the user's token
  token: null,
  // the user's incomes
  incomes: [],
  // the user's expenses
  expenses: [],
  // the user's budgets
  budgets: [],
  // the user's saving goals
  savingGoals: [],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /**/
    /*
    NAME

            setMode - A function that toggles the application mode between light and dark.

    SYNOPSIS

            setMode(state)
                state --> The current state of the application.

    DESCRIPTION

            The setMode function toggles the application mode between light and dark.

    RETURNS

            The function does not return a value.


    */
    /**/
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    /**/
    /*
    NAME

            setLogin - A function that sets the user and token in the state.

    SYNOPSIS

            setLogin(state, action)
                state --> The current state object.
                action --> The action object containing the user and token payload.

    DESCRIPTION

            The setLogin function sets the user and token in the state.

    RETURNS

            The function does not return a value.

    */
    /**/
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    /**/
    /*

    NAME

            setLogout - A function that clears the user, token, incomes, expenses, budgets, and saving goals from the state.

    SYNOPSIS

            setLogout(state)
                state --> The current state object.

    DESCRIPTION

            The setLogout function clears the user, token, incomes, expenses, budgets, and saving goals from the state.
    
    RETURNS

            The function does not return a value.
    */
    /**/
    setLogout: (state) => {
      state.user = null;
      state.token = null;
      state.incomes = [];
      state.expenses = [];
      state.budgets = [];
      state.savingGoals = [];
    },
    /**/
    /*
    NAME

            setIncomes - A function that sets the incomes in the state.

    SYNOPSIS

            setIncomes(state, action)
                state --> The current state of the application.
                action --> The action object containing the incomes payload.

    DESCRIPTION

            The setIncomes function sets the incomes in the state.

    RETURNS

            The function does not return a value.
    */
    /**/
    setIncomes: (state, action) => {
      state.incomes = action.payload.incomes;
    },
    /**/
    /*
    NAME

            setIncome - A function that updates a specific income in the state by mapping over the existing incomes and replacing the income with the matching ID.

    SYNOPSIS

            setIncome(state, action)
                state --> The current state of the application.
                action --> The action object containing the income payload.

    DESCRIPTION

            The setIncome function updates a specific income in the state by mapping over the existing incomes and replacing the income with the matching ID.

    RETURNS

            The function does not return a value.

    */
    /**/
    setIncome: (state, action) => {
      const updatedIncomes = state.incomes.map((income) => {
        if (income._id === action.payload.income._id)
          return action.payload.income;
        return income;
      });
      state.incomes = updatedIncomes;
    },
    /**/
    /*
    NAME

            setExpenses - A function that sets the expenses in the state.

    SYNOPSIS

            setExpenses(state, action)
                state --> The current state of the application.
                action --> The action object containing the expenses payload.

    DESCRIPTION

            The setExpenses function sets the expenses in the state.

    RETURNS

            The function does not return a value.

    */
    /**/
    setExpenses: (state, action) => {
      state.expenses = action.payload.expenses;
    },
    /**/
    /*
    NAME

            setExpense - A function that updates a specific expense in the state by mapping over the existing expenses and replacing the expense with the matching ID.

    SYNOPSIS

            setExpense(state, action)
                state --> The current state of the application.
                action --> The action object containing the expense payload.

    DESCRIPTION

            The setExpense function updates a specific expense in the state by mapping over the existing expenses and replacing the expense with the matching ID.


    RETURNS

            The function does not return a value.

    */
    /**/

    setExpense: (state, action) => {
      const updatedExpenses = state.expenses.map((expense) => {
        if (expense._id === action.payload.expense._id)
          return action.payload.expense;
        return expense;
      });
      state.expenses = updatedExpenses;
    },
    /**/
    /*

    NAME

            setBudgets - A function that sets the budgets in the state.

    SYNOPSIS

            setBudgets(state, action)
                state --> The current state of the application.
                action --> The action object containing the budgets payload.

    DESCRIPTION

            The setBudgets function sets the budgets in the state.

    RETURNS

            The function does not return a value.

    */
    /**/
    setBudgets: (state, action) => {
      state.budgets = action.payload.budgets;
    },
    /**/
    /*

    NAME  

            setBudget - A function that updates a specific budget in the state by mapping over the existing budgets and replacing the budget with the matching ID.

    SYNOPSIS

            setBudget(state, action)
                state --> The current state of the application.
                action --> The action object containing the budget payload.

    DESCRIPTION

            The setBudget function updates a specific budget in the state by mapping over the existing budgets and replacing the budget with the matching ID.

    RETURNS

            The function does not return a value.

    */
    /**/
    setBudget: (state, action) => {
      const updatedBudgets = state.budgets.map((budget) => {
        if (budget._id === action.payload.budget._id)
          return action.payload.budget;
        return budget;
      });
      state.budgets = updatedBudgets;
    },
    /**/
    /*
    NAME

            setSavingGoals - A function that sets the saving goals in the state.

    SYNOPSIS

            setSavingGoals(state, action)
                state --> The current state of the application.
                action --> The action object containing the saving goals payload.

    DESCRIPTION

            The setSavingGoals function sets the saving goals in the state.

    RETURNS

            The function does not return a value.

    */
    /**/
    setSavingGoals: (state, action) => {
      state.savingGoals = action.payload.savingGoals;
    },
    /**/
    /*
    NAME

            setSavingGoal - A function that updates a specific saving goal in the state by mapping over the existing saving goals and replacing the saving goal with the matching ID.

    SYNOPSIS

            setSavingGoal(state, action)
                state --> The current state of the application.
                action --> The action object containing the saving goal payload.

    DESCRIPTION

            The setSavingGoal function updates a specific saving goal in the state by mapping over the existing saving goals and replacing the saving goal with the matching ID.

    RETURNS

            The function does not return a value.

    */
    /**/
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

// The actions from the auth slice.
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
