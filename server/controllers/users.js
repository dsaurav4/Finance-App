import User from "../models/User.js";

/* READ */
/**/
/*

NAME

        getUser - Retrieves a user by ID.

SYNOPSIS

        getUser(req, res)
              req --> The request object containing the user's ID.
              res --> The response object.

DESCRIPTION

        The getUser function retrieves a user by ID by querying the database for a user that matches the ID.

RETURNS

        Returns a JSON response containing the user.

*/
/**/
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
