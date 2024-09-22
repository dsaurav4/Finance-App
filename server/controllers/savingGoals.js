import SavingGoal from "../models/SavingGoal.js";
import User from "../models/User.js";

/* GET */
/**/
/*

NAME

        getSavingGoals - Retrieves the saving goals for a specific user.

SYNOPSIS

        getSavingGoals(req, res)
              req --> The request object containing the user's ID.
              res --> The response object.

DESCRIPTION

        The getSavingGoals function retrieves the saving goals for a specific user by querying the 
        database for saving goals that match the user's ID.

RETURNS

        Returns a JSON response containing the list of saving goals for the user.

*/
/**/
export const getSavingGoals = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const savingGoals = await SavingGoal.find({ userId: user._id });

    res.status(200).json(savingGoals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* CREATE */
/**/
/*

NAME

        postSavingGoals - Creates a new saving goal for a specific user.

SYNOPSIS

        postSavingGoals(req, res)
              req --> The request object containing the user's ID and the saving goal data.
              res --> The response object.

DESCRIPTION

        The postSavingGoals function creates a new saving goal for a specific user by checking if the user exists, 
        validating the saving goal data, and saving the saving goal to the database.

RETURNS

        Returns a JSON response containing the updated list of saving goals for the user.

*/
/**/
export const postSavingGoals = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found!" });
      return;
    }

    const { goalName, targetAmount, startDate, endDate } = req.body;

    const newSavingGoal = new SavingGoal({
      userId: user._id,
      goalName,
      targetAmount,
      currentAmount: 0,
      startDate,
      endDate,
    });

    const savedSavingGoal = await newSavingGoal.save();

    await User.findByIdAndUpdate(user._id, {
      $push: { savingGoals: savedSavingGoal._id },
    });

    const updatedSavingGoals = await SavingGoal.find({ userId: user._id });

    res.status(201).json(updatedSavingGoals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* UPDATE */
/**/
/*

NAME

        updateSavingGoal - Updates the current amount of a saving goal by adding the amount specified in the request body.

SYNOPSIS

        updateSavingGoal(req, res)
              req --> The request object containing the user's ID and the saving goal ID.
              res --> The response object.

DESCRIPTION

        The updateSavingGoal function updates the current amount of a saving goal by adding the amount specified in the request body.

RETURNS

        Returns a JSON response containing the updated saving goal.

*/
/**/
export const updateSavingGoal = async (req, res) => {
  try {
    const { userId, id } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found!" });
      return;
    }

    const { addedMoney } = req.body;
    const { currentAmount } = await SavingGoal.findById(id);

    const newAmount = parseInt(addedMoney, 10) + parseInt(currentAmount, 10);

    const updatedSavingGoal = await SavingGoal.findByIdAndUpdate(
      id,
      {
        currentAmount: newAmount,
      },
      { new: true }
    );

    res.status(200).json(updatedSavingGoal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* DELETE */
/**/
/*

NAME

        deleteSavingGoals - Deletes a saving goal by ID and updates the user's saving goals list.

SYNOPSIS

        deleteSavingGoals(req, res)
              req --> The request object containing the user's ID and saving goal ID.
              res --> The response object.

DESCRIPTION

        The deleteSavingGoals function deletes a saving goal by ID and updates the user's saving goals list.

RETURNS

        Returns a JSON response containing the updated list of saving goals for the user.

*/
/**/
export const deleteSavingGoals = async (req, res) => {
  try {
    const { userId, id } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found!" });
      return;
    }

    const deletedSavingGoal = await SavingGoal.findByIdAndDelete(id);

    if (!deletedSavingGoal) {
      res.status(404).json({ message: "Saving Goal not found!" });
      return;
    }

    await User.findByIdAndUpdate(user._id, {
      $pull: { savingGoals: deletedSavingGoal._id },
    });

    const updatedSavingGoals = await SavingGoal.find();

    res.status(200).json(updatedSavingGoals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
