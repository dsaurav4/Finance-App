import Income from "../models/Income.js";
import Expense from "../models/Expense.js";
import User from "../models/User.js";

/* READ */
export const getIncome = async (req, res) => {
  try {
    const { userId } = req.params;

    const income = await Income.find({ userId });

    res.status(200).json(income);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

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
