import Income from "../models/Income.js";
import Expense from "../models/Expense.js";
import User from "../models/User.js";

/* READ */
/**/
/*

NAME

        getIncome - Retrieves a list of incomes for a specific user.

SYNOPSIS

        getIncome(req, res)
              req --> The request object containing the user's ID.
              res --> The response object.

DESCRIPTION

        The getIncome function retrieves a list of incomes for a specific user by querying the database for incomes that match the user's ID.

RETURNS

        Returns a JSON response containing the list of incomes for the user.

*/
/**/
export const getIncome = async (req, res) => {
  try {
    const { userId } = req.params;

    const income = await Income.find({ userId });

    res.status(200).json(income);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

/**/
/*

NAME

        getExpense - Retrieves a list of expenses for a specific user.

SYNOPSIS

        getExpense(req, res)
              req --> The request object containing the user's ID.
              res --> The response object.

DESCRIPTION

        The getExpense function retrieves a list of expenses for a specific user by querying the database for expenses that match the user's ID.

RETURNS

        Returns a JSON response containing the list of expenses for the user.

*/
/**/
export const getExpense = async (req, res) => {
  try {
    const { userId } = req.params;
    const expense = await Expense.find({ userId });

    res.status(200).json(expense);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

/* UPDATE */
/**/
/*

NAME

        editIncome - Updates an existing income entry by ID.

SYNOPSIS

        editIncome(req, res)
              req --> The request object containing the income ID and updated details.
              res --> The response object.

DESCRIPTION

        The editIncome function updates an existing income entry by ID.

RETURNS

        Returns a JSON response containing the updated income entry.

*/
/**/
export const postIncome = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { description, amount, date, category } = req.body;

    console.log(description, amount, date, category);

    const newIncome = new Income({
      userId: user._id,
      description,
      amount,
      date,
      category,
    });

    const savedIncome = await newIncome.save();

    await User.findByIdAndUpdate(user._id, {
      $push: { incomes: savedIncome._id },
    });

    const updatedIncomes = await Income.find({ userId: user._id });

    res.status(201).json(updatedIncomes);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

/**
 * Creates a new expense entry for a specific user.
 *
 * @param {Object} req - The request object containing the user's ID and expense details.
 * @param {Object} res - The response object.
 * @return {Object} A JSON response containing the updated list of expenses for the user.
 */
export const postExpense = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { description, amount, date, category } = req.body;
    const newExpense = new Expense({
      userId: user._id,
      description,
      amount,
      date,
      category,
    });

    const savedExpense = await newExpense.save();

    await User.findByIdAndUpdate(userId, {
      $push: { expenses: savedExpense._id },
    });

    const updatedExpenses = await Expense.find({ userId: user._id });

    res.status(201).json(updatedExpenses);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

/* PATCH */
/**/
/*

NAME

        editIncome - Updates an existing income entry by ID.

SYNOPSIS

        editIncome(req, res)
              req --> The request object containing the income ID and updated details.
              res --> The response object.

DESCRIPTION

        The editIncome function updates an existing income entry by ID.

RETURNS

        Returns a JSON response containing the updated income entry.

*/
/**/
export const editIncome = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, amount, date, category } = req.body;

    const updatedIncome = await Income.findByIdAndUpdate(
      id,
      {
        description,
        amount,
        date,
        category,
      },
      { new: true }
    );
    res.status(200).json(updatedIncome);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

/**/
/*

NAME

        editExpense - Updates an existing expense entry by ID.

SYNOPSIS

        editExpense(req, res)
              req --> The request object containing the expense ID and updated details.
              res --> The response object.

DESCRIPTION

        The editExpense function updates an existing expense entry by ID.

RETURNS

        Returns a JSON response containing the updated expense entry.

*/
/**/
export const editExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, amount, date, category } = req.body;

    const updatedExpense = await Expense.findByIdAndUpdate(
      id,
      {
        description,
        amount,
        date,
        category,
      },
      { new: true }
    );
    res.status(200).json(updatedExpense);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

/* DELETE */
/**/
/*

NAME

        deleteIncome - Deletes an income entry by ID and updates the user's income list.

SYNOPSIS

        deleteIncome(req, res)
              req --> The request object containing the user's ID and income ID.
              res --> The response object.

DESCRIPTION

        The deleteIncome function deletes an income entry by ID and updates the user's income list.

RETURNS

        Returns a JSON response containing the updated list of incomes for the user.

*/
/**/
export const deleteIncome = async (req, res) => {
  try {
    const { userId, id } = req.params;

    const deletedIncome = await Income.findByIdAndDelete(id);

    if (!deletedIncome) {
      return res.status(404).json({ message: "Income not found" });
    }

    await User.findByIdAndUpdate(userId, {
      $pull: { incomes: deletedIncome._id },
    });

    const updatedIncomes = await Income.find({ userId });

    res.status(201).json(updatedIncomes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**/
/*

NAME

        deleteExpense - Deletes an expense entry by ID and updates the user's expense list.

SYNOPSIS

        deleteExpense(req, res)
              req --> The request object containing the user's ID and expense ID.
              res --> The response object.

DESCRIPTION

        The deleteExpense function deletes an expense entry by ID and updates the user's expense list.

RETURNS

        Returns a JSON response containing the updated list of expenses for the user.

*/
/**/
export const deleteExpense = async (req, res) => {
  try {
    const { userId, id } = req.params;

    const deletedExpense = await Expense.findByIdAndDelete(id);

    if (!deletedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    await User.findByIdAndUpdate(userId, {
      $pull: { expenses: deletedExpense._id },
    });

    const updatedExpenses = await Expense.find({ userId });

    res.status(201).json(updatedExpenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
