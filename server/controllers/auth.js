import bcrypt from "bcrypt";
import fs from "fs";
import User from "../models/User.js";
import Verification from "../models/Verification..js";
import ResetCode from "../models/ResetCodes.js";
import jwt from "jsonwebtoken";
import uploadOnCloudinary from "../utils/cloudinary.js";
import sendMail from "../utils/sendMail.js";
import { validate } from "deep-email-validator";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();

/* RESGISTER */
/**/
/*
NAME

        register - A function that registers a new user.

SYNOPSIS

        register(req, res)
            req --> The request object containing the user's details.
            res --> The response object.

DESCRIPTION

        The register function registers a new user by checking if the username or email already exists in the database.
        The function then hashes the password and saves the user details in the database. 
        If the user is successfully registered, a verification link is generated and sent to the user's email.

RETURNS

        The function returns a JSON response with a message indicating the status of the registration process.

*/
/**/
export const register = async (req, res) => {
  try {
    const { firstName, lastName, username, email, password } = req.body;

    const user = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (user) {
      return res
        .status(409)
        .json({ message: "Username or email already exists" });
    }

    // const isEmailExist = await validate(email);

    // if (!isEmailExist.valid) {
    //   return res
    //     .status(409)
    //     .json({ message: "Email is not valid! Please enter a valid email." });
    // }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    let picturePath;
    if (req.file) {
      const localFilePath = req.file.path;
      const cloudinaryResponse = await uploadOnCloudinary(localFilePath);
      if (!cloudinaryResponse) {
        return res.status(500).json({ message: "File upload failed" });
      }
      picturePath = cloudinaryResponse.url;
    }

    const newUser = new User({
      firstName,
      lastName,
      username,
      email,
      password: passwordHash,
      picturePath,
    });

    const savedUser = await newUser.save();

    if (savedUser) {
      const validationCode = uuidv4();
      console.log(validationCode);
      const codeSalt = await bcrypt.genSalt();
      const codeHash = await bcrypt.hash(validationCode, codeSalt);

      const newVerification = new Verification({
        userId: savedUser._id,
        code: codeHash,
      });

      await newVerification.save();

      const PORT = process.env.PORT || 6001;
      const url = `http://localhost:${PORT}`;

      await sendMail(
        savedUser.email,
        "Verify Email For Your FINANCE APP",
        "Please click the link below to verify your email.",
        `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5;">
          <h2 style="color: #4CAF50;">Verify Your Email Address</h2>
          <p>Hello ${savedUser.firstName},</p>
          <p>Thank you for registering with us! Please click the button below to verify your email address and complete your registration.</p>
          
          <div style="text-align: center; margin: 20px 0;">
            <a href="${url}/auth/verify/${savedUser._id}/${validationCode}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: white; background-color: #4CAF50; text-decoration: none; border-radius: 5px;">
              Verify Email
            </a>
          </div>
          
          <p>If the button above does not work, copy and paste the following link into your web browser:</p>
          <p style="word-wrap: break-word;">
            <a href="${url}/auth/verify/${savedUser._id}/${validationCode}" style="color: #4CAF50;">${url}/auth/verify/${savedUser._id}/${validationCode}</a>
          </p>
          
          <p><b>Please note:</b> This verification link will expire in 1 hour.</p>
          
          <p>Best regards,</p>
          <p>The Finance App</p>
        </div>
       `
      );
    }
    res.status(201).json({
      message:
        "Account created! Please verify your account. An link has been sent to your email.",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
  }
};

/* LOGIN */
/**/
/*

NAME

        login - A function that logs in a user.

SYNOPSIS

        login(req, res)
            req --> The request object containing the user's username and password.
            res --> The response object.

DESCRIPTION

        The login function logs in a user by checking if the user exists in the database and verifying the password.
        If the user is not verified, the function sends a verification link to the user's email.

RETURNS

        The function returns a JSON response with a token and the user's details if the login is successful.

*/
/**/
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username: username });
    if (!user) return res.status(400).json({ message: "User does not exist." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid Credentials. " });

    const isVerified = user.verifiedUser;
    if (!isVerified) {
      const verification = Verification.find({ userId: user._id });
      if (verification.expiresAt < Date.now()) {
        const validationCode = uuidv4();
        const codeSalt = await bcrypt.genSalt();
        const codeHash = await bcrypt.hash(validationCode, codeSalt);

        await Verification.findByIdAndUpdate(verification._id, {
          code: codeHash,
          expiresAt: Date.now() + 3600000,
        });

        const url = `http://localhost:${PORT}`;

        await sendMail(
          user.email,
          "Verify Email For Your FINANCE APP",
          "Please click the link below to verify your email.",
          `
            <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5;">
              <h2 style="color: #4CAF50;">Verify Your Email Address</h2>
              <p>Hello ${savedUser.firstName},</p>
              <p>Thank you for registering with us! Please click the button below to verify your email address and complete your registration.</p>
              
              <div style="text-align: center; margin: 20px 0;">
                <a href="${url}/auth/verify/${savedUser._id}/${validationCode}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: white; background-color: #4CAF50; text-decoration: none; border-radius: 5px;">
                  Verify Email
                </a>
              </div>
              
              <p>If the button above does not work, copy and paste the following link into your web browser:</p>
              <p style="word-wrap: break-word;">
                <a href="${url}/auth/verify/${savedUser._id}/${validationCode}" style="color: #4CAF50;">${url}/auth/verify/${savedUser._id}/${validationCode}</a>
              </p>
              
              <p><b>Please note:</b> This verification link will expire in 1 hour.</p>
              
              <p>Best regards,</p>
              <p>The Finance App</p>
            </div>
          `
        );
      }
      return res
        .status(400)
        .json({ message: "User not verified. Please check your email." });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;

    res.status(200).json({ token, user });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
};

/* VERIFY USER */
/**/
/*

NAME

        verifyCode - A function that verifies a user's email.

SYNOPSIS

        verifyCode(req, res)
            req --> The request object containing the user's ID and verification code.
            res --> The response object.

DESCRIPTION

        The verifyCode function verifies a user's email by checking if the verification code is valid.

RETURNS

        The function returns a JSON response with a message indicating the status of the verification process.

*/
/**/
export const verifyCode = async (req, res) => {
  try {
    const { userId, code } = req.params;

    const verification = await Verification.findOne({ userId });
    const isMatch = await bcrypt.compare(code, verification.code);

    console.log("Date:", Date.now().toLocaleString());

    if (
      !verification ||
      verification.expiresAt < Date.now().toLocaleString() ||
      !isMatch
    )
      return res.status(409).json({ message: "Verification link not valid" });

    const user = await User.findById(userId);

    if (!user) return res.status(409).json({ message: "User does not exist" });

    await User.findByIdAndUpdate(user._id, {
      verifiedUser: true,
    });

    await Verification.findByIdAndDelete(verification._id);

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const filePath = path.join(__dirname, "../views/verified.html");
    res.status(200).sendFile(filePath);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* RESET PASSWORD */
/**/
/*

NAME

        resetPassword - A function that resets a user's password.

SYNOPSIS

        resetPassword(req, res)
            req --> The request object containing the user's email.
            res --> The response object.

DESCRIPTION

        The resetPassword function resets a user's password by generating a new reset code and sending it to the user's email.

RETURNS

        The function returns a JSON response with the user's ID if the reset code is successfully generated.

*/
/**/
export const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email does not exist." });
    }

    const oldResetCode = await ResetCode.findOne({ userId: user._id });

    if (oldResetCode) await ResetCode.findByIdAndDelete(oldResetCode._id);

    const randomCode = Math.floor(10000 + Math.random() * 90000)
      .toString()
      .padStart(5, "0");

    const codeSalt = await bcrypt.genSalt();
    const codeHash = await bcrypt.hash(randomCode, codeSalt);

    const newReset = new ResetCode({
      userId: user._id,
      code: codeHash,
      email: user.email,
    });

    await newReset.save();

    await sendMail(
      user.email,
      "RESET YOUR PASSWORD FOR THE FINANCE APP",
      "Your reset code is",
      `<b>${randomCode}</b>
      <br>
      <i>The code expires in <b>1 hour</b>.</i>`
    );

    return res.status(200).json(newReset.userId);
  } catch (error) {
    console.error("Error in resetPassword:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

/* VERIFY RESET CODE */
/**/
/*

NAME

        verifyResetCode - A function that verifies a user's reset code.

SYNOPSIS

        verifyResetCode(req, res)
            req --> The request object containing the user's ID and reset code.
            res --> The response object.

DESCRIPTION

        The verifyResetCode function verifies a user's reset code by checking if the reset code is valid.

RETURNS

        The function returns a JSON response with a message indicating the status of the reset code verification process.

*/
/**/
export const verifyResetCode = async (req, res) => {
  try {
    const { code } = req.body;
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ message: "User does not exist." });
    }

    const reset = await ResetCode.findOne({ userId });

    if (!reset) {
      return res.status(400).json({ message: "Reset Code not available." });
    }

    const isMatch = await bcrypt.compare(code, reset.code);

    if (!isMatch) {
      return res.status(400).json({ message: "Reset Code not valid." });
    }

    return res.status(200).json({ message: "Reset code verified!" });
  } catch (error) {
    console.error("Error in verifyResetCode:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

/* UPDATE PASSWORD */
/**/
/*

NAME

        updatePassword - A function that updates a user's password.

SYNOPSIS

        updatePassword(req, res)
            req --> The request object containing the user's ID and new password.
            res --> The response object.

DESCRIPTION

        The updatePassword function updates a user's password by hashing the new password and saving it in the database.

RETURNS

        The function returns a JSON response with a message indicating the status of the password update process.

*/
/**/
export const updatePassword = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ message: "User does not exist." });
    }

    const { password } = req.body;

    const passwordSalt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, passwordSalt);

    await User.findByIdAndUpdate(
      userId,
      { password: passwordHash },
      { new: true }
    );

    res.status(200).json({ message: "Password Changed Succesfully" });
  } catch (error) {
    console.error("Error in updatePassword:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
