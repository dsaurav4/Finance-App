import jwt from "jsonwebtoken";

/**/
/*

NAME

        verifyToken - Verifies the JWT token.

SYNOPSIS

        verifyToken(req, res, next)
              req --> The request object containing the JWT token.
              res --> The response object.
              next --> The next function that called the middleware.

DESCRIPTION

        The verifyToken function verifies the JWT token by checking if the token is present in the request header,
        extracting the token from the header, and verifying the token using the JWT secret key.

RETURNS

        Returns the next function if the token is verified successfully.

*/
/**/

export const verifyToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization");
    if (!token) return res.status(403).send("Access Denied");

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
