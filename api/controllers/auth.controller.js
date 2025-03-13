import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcryptjs.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({
      email,
    });

    if (!validUser) {
      return next(errorHandler(404, "User not found."));
    }

    const validPassword = await bcryptjs.compare(password, validUser.password);

    if (!validPassword) {
      return next(errorHandler(401, "Invalid credentials."));
    }

    const token = jwt.sign(
      {
        id: validUser._id,
        username: validUser.username,
        email: validUser.email,
      },
      process.env.JWT_SECRET
    );

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });
    res.status(200).send("User logged in successfully");
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};
