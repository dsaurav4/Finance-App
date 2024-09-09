import bcrypt from "bcrypt";
import fs from "fs";
import User from "../models/User.js";
import Verification from "../models/Verification..js";
import jwt from "jsonwebtoken";
import uploadOnCloudinary from "../utils/cloudinary.js";
import sendMail from "../utils/sendMail.js";
import { validate } from "deep-email-validator";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();

/* REGISTER */
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

      sendMail(
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

/* LOGGING IN */
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

        sendMail(
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
