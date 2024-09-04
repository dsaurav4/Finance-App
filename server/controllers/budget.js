import Budget from "../models/Budget.js";
import User from "../models/User.js";

/* READ */
export const getBudgets = async (req, res) => {
  try {
    const { userId } = req.params;
    const budgets = await Budget.find({ userId });

    res.status(200).json({ budgets });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

/* CREATE */
export const postBudget = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found!" });
      return;
    }
    const { period, amount, startDate, endDate } = req.body;

    const newBudget = new Budget({
      userId: user._id,
      period,
      amount,
      startDate,
      endDate,
    });

    const savedBudget = await newBudget.save();

    await User.findByIdAndUpdate(user._id, {
      $push: { budgets: savedBudget._id },
    });

    const budgets = await Budget.find({ userId: user._id });
    res.status(201).json({ budgets });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

/* UPDATE */
export const updateBudget = async (req, res) => {
  try {
    const { id } = req.params;

    const { period, amount, startDate, endDate } = req.body;

    const updatedBudget = await Budget.findByIdAndUpdate(
      id,
      {
        period,
        amount,
        startDate,
        endDate,
      },
      {
        new: true,
      }
    );

    res.status(200).json(updatedBudget);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

/* DELETE */
export const deleteBudget = async (req, res) => {
  try {
    const { userId, id } = req.params;

    const deletedBudget = await Budget.findByIdAndDelete(id);

    if (!deletedBudget) {
      return res.status(404).json({ message: "Budget not found!" });
    }

    await User.findByIdAndUpdate(userId, {
      $pull: { budgets: deletedBudget._id },
    });

    const updatedBudgets = await Budget.find({ userId });
    res.status(200).json(updatedBudgets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
