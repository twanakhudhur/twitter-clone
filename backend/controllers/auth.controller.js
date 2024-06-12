import { generateTokenAndSetCookie } from "../libs/utils/generateToken.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  try {
    const { username, fullName, email, password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already taken!" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already taken!" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        username: newUser.username,
        fullName: newUser.fullName,
        email: newUser.email,
        profileImg: newUser.profileImg,
        coverImg: newUser.coverImg,
        followers: newUser.followers,
        following: newUser.following,
        bio: newUser.bio,
        link: newUser.link,
      });
    } else {
      res.status(400).json({ message: "Invalid user data!" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error!", message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const isPasswordsCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );
    if (!user || !isPasswordsCorrect) {
      return res.status(400).json({ message: "Invalid username or password!" });
    }
    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      profileImg: user.profileImg,
      coverImg: user.coverImg,
      followers: user.followers,
      following: user.following,
      bio: user.bio,
      link: user.link,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error!", message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error!", message: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error!", message: error.message });
  }
};
