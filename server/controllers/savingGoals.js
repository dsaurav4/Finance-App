import SavingGoal from "../models/SavingGoal.js";
import User from "../models/User.js";

/* GET */
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
export const postSavingGoals = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found!" });
      return;
    }

    const {
      goalName,
      targetAmount,
      currentAmount,
      startDate,
      endDate,
      description,
    } = req.body;

    const newSavingGoal = new SavingGoal({
      userId: user._id,
      goalName,
      targetAmount,
      currentAmount,
      startDate,
      endDate,
      description,
    });

    const savedSavingGoal = await newSavingGoal.save();

    await User.findByIdAndUpdate(user._id, {
      $push: { savingGoals: savedSavingGoal._id },
    });

    const updatedSavingGoals = await SavingGoal.find();

    res.status(201).json(updatedSavingGoals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* UPDATE */
export const updateSavingGoal = async (req, res) => {
  try {
    const { userId, id } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found!" });
      return;
    }

    const {
      goalName,
      targetAmount,
      currentAmount,
      startDate,
      endDate,
      description,
    } = req.body;

    const updatedSavingGoal = await SavingGoal.findByIdAndUpdate(id, {
      goalName,
      targetAmount,
      currentAmount,
      startDate,
      endDate,
      description,
    });
    res.status(200).json(updatedSavingGoal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* DELETE */
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
