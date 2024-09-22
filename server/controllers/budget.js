import Budget from "../models/Budget.js";
import User from "../models/User.js";

/* READ */
/**/
/*

NAME

        getBudgets - Retrieves the budgets for a specific user.

SYNOPSIS

        getBudgets(req, res)
              req --> The request object containing the user's ID.
              res --> The response object.  

DESCRIPTION

        The getBudgets function retrieves the budgets for a specific user by querying the database for budgets that match the user's ID.

RETURNS

        Returns a JSON response containing the list of budgets for the user.

*/
/**/
export const getBudgets = async (req, res) => {
  try {
    const { userId } = req.params;
    const budgets = await Budget.find({ userId });

    res.status(200).json(budgets);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

/* CREATE */
/**/
/*

NAME

        postBudget - Creates a new budget for a specific user.

SYNOPSIS

        postBudget(req, res)
              req --> The request object containing the user's ID and the budget data.
              res --> The response object.

DESCRIPTION

        The postBudget function creates a new budget for a specific user by checking if the user exists, validating the budget data, and saving the budget to the database.

RETURNS

        Returns a JSON response containing the updated list of budgets for the user.

*/
export const postBudget = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const { period, amount, startDate, endDate } = req.body;

    const existingBudgets = await Budget.find({
      userId: user._id,
      period,
      $or: [
        {
          startDate: { $lte: new Date(endDate) },
          endDate: { $gte: new Date(startDate) },
        },
      ],
    });

    if (existingBudgets.length > 0) {
      return res.status(400).json({
        message: `You already have a ${period.toLowerCase()} budget overlapping within the selected period.`,
      });
    }

    const newBudget = new Budget({
      userId: user._id,
      period,
      amount,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    });

    const savedBudget = await newBudget.save();

    await User.findByIdAndUpdate(user._id, {
      $push: { budgets: savedBudget._id },
    });

    const budgets = await Budget.find({ userId: user._id });

    res.status(201).json(budgets);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

/* DELETE */
/**/
/*

NAME

        deleteBudget - Deletes a budget for a specific user.

SYNOPSIS

        deleteBudget(req, res)
              req --> The request object containing the user's ID and the budget ID.
              res --> The response object.

DESCRIPTION

        The deleteBudget function deletes a budget for a specific user by checking if the budget exists, deleting the budget from the database, and updating the user's list of budgets.

RETURNS
  
          Returns a JSON response containing the updated list of budgets for the user.
  
  */
/**/
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
