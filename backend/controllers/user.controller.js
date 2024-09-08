import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";

import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

export const getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found!" });
    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error!", message: error.message });
  }
};

export const followUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);
    if (id === req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: "You can't follow/unfollow yourself!" });
    }
    if (!userToModify || !currentUser)
      return res.status(404).json({ message: "User not found!" });

    const isFollowing = currentUser.following.includes(id);
    if (isFollowing) {
      // unfollow
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { following: id },
      });
      //   TODO: return the id of the user as a response
      res.status(200).json({ message: "User Unfollowed!" });
    } else {
      // follow
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, {
        $push: { following: id },
      });
      //   send notification to user
      const newNotification = new Notification({
        type: "follow",
        from: req.user._id,
        to: userToModify._id,
      });

      await newNotification.save();
      //   TODO: return the id of the user as a response
      res.status(200).json({ message: "User Followed!" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error!", message: error.message });
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const userId = req.user._id;

    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: userId },
          followers: { $nin: [userId] },
        },
      },
      {
        $project: {
          _id: 1,
          username: 1,
        },
      },
      { $sample: { size: 10 } },
    ]);
    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error!", message: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  const { fullName, email, username, currentPassword, newPassword, bio, link } =
    req.body;
  let { profileImg, coverImg } = req.body;
  const userId = req.user._id;
  try {
    let user = await User.findOne(userId);
    if (!user) return res.status(404).json({ message: "User not found!" });

    if (
      (!newPassword && currentPassword) ||
      (!currentPassword && newPassword)
    ) {
      return res.status(400).json({
        message: "Please provide both current password and new password!",
      });
    }
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch)
        return res.status(400).json({ message: "Currrent password mismatch" });
      if (newPassword.length < 6)
        return res
          .status(400)
          .json({ message: "Password must be at least 6 characters" });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }
    if (profileImg) {
      if (user.profileImg) {
        await cloudinary.uploader.destroy(`
          twitter-clone/profile/${
            user.profileImg.split("/").pop().split(".")[0]
          }`);
      }

      const uploadedResponse = await cloudinary.uploader.upload(profileImg, {
        folder: "twitter-clone/profile",
      });
      profileImg = uploadedResponse.secure_url;
    }
    if (coverImg) {
      if (user.coverImg) {
        await cloudinary.uploader.destroy(`
          twitter-clone/cover/${user.coverImg.split("/").pop().split(".")[0]}`);
      }
      const uploadedResponse = await cloudinary.uploader.upload(coverImg, {
        folder: "twitter-clone/cover",
      });
      coverImg = uploadedResponse.secure_url;
    }

    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.username = username || user.username;
    user.bio = bio || user.bio;
    user.link = link || user.link;
    user.profileImg = profileImg || user.profileImg;
    user.coverImg = coverImg || user.coverImg;
    user = await user.save();
    user.password = null;
    return res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error!", message: error.message });
  }
};
