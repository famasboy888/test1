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
      accountStatus: "active",
    }).exec();

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

    const { password: hashedPassword, ...rest } = validUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};

export const google = async (req, res, next) => {
  try {
    const { name, email, photo } = req.body;
    console.log(email);
    const user = await User.findOne({
      email,
    }).exec();

    if (user) {
      const token = jwt.sign(
        {
          id: user._id,
        },
        process.env.JWT_SECRET
      );

      const { password: hashedPassword, ...rest } = user._doc;

      res.cookie("access_token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
      });

      res.status(200).json(rest);
    } else {
      const generatePassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcryptjs.hash(generatePassword, 10);
      const generateUsername =
        name.split(" ").join("").toLowerCase() +
        Math.random().toString(36).slice(-4);
      const newUser = new User({
        username: generateUsername,
        email,
        password: hashedPassword,
        avatar: photo,
      });

      const addedUser = await newUser.save();

      if (addedUser) {
        const token = jwt.sign(
          {
            id: addedUser._id,
          },
          process.env.JWT_SECRET
        );

        const { password: hashedPassword, ...rest } = addedUser._doc;

        res.cookie("access_token", token, {
          httpOnly: true,
          secure: false,
          sameSite: "strict",
          maxAge: 15 * 60 * 1000,
        });

        res.status(200).json(rest);
      } else {
        next(errorHandler(500, "User did not create successfully."));
      }
    }
  } catch (error) {
    next(error);
  }
};

export const signOutUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(
      errorHandler(
        401,
        "Unauthorized Account - You can only update your account"
      )
    );
  }
  try {
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });

    res.set("Clear-Site-Data", '"cache", "cookies", "storage"');

    res.status(200).json("Successfully signed out.");
  } catch (error) {
    next(error);
  }
};
