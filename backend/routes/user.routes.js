import { Router } from "express";
import { v2 as cloudinary } from "cloudinary";
import bcrypt from "bcrypt";
import { protectRoute } from "../middleware/protectRoute.js";
import { User } from "../models/user.model.js";
import { Notification } from "../models/notification.model.js";

const router = Router();

//runs for all routes
router.use(protectRoute);

router.get("/profile/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username }).select("-password");

    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    console.log(`Error in /profile/:username route ${error.message}`);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/suggested-to-follow", async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    //find the users that the logged in user followed
    const usersFollowedByMe = await User.findById(loggedInUserId).select(
      "following"
    );

    //match where the _id is not = to the loggedInUserId and give us a sample size of 10 different users
    //Get 10 different users and nor the autheniticated user
    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: loggedInUserId }
        }
      },
      { $sample: { size: 10 } }
    ]);

    //exclude users that we follow
    const filteredUsers = users.filter(
      (user) => !usersFollowedByMe.following.includes(user._id)
    );

    //get 4 suggested users
    const suggestedUsers = filteredUsers.slice(0, 4);

    //set each passsword to null for each user
    suggestedUsers.forEach((user) => (user.password = null));

    res.status(200).json(suggestedUsers);
  } catch (error) {
    console.log(`Error in suggested users route:`, error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/follow-unfollow/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const userToFollow = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    //prevent user from following them selves
    if (id === req.user._id.toString())
      return res
        .status(400)
        .json({ error: "You can't follow or unfollow yourself" });

    if (!userToFollow || !currentUser)
      return res.status(400).json({ error: "User not found" });

    //follow or unfollow functionality

    //check if we are following the user
    const isFollowing = currentUser.following.includes(id);

    if (isFollowing) {
      //unfollow user
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });

      //return the id of the user as a response
      res.status(200).json({ message: "User unfollowed successfully" });
    } else {
      //follow user
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } }); //add id of user we just followed

      //send notification
      const newNotification = new Notification({
        type: "follow",
        from: req.user._id,
        to: userToFollow._id
      });

      await newNotification.save();

      //return the id of the user as a response
      res.status(200).json({ message: "User followed successfully" });
    }
  } catch (error) {
    console.log(`Error in /follow-unfollow/:id route ${error.message}`);
    return res.status(500).json({ error: "Internal server error" });
  }
});
router.post("/update-profile", async (req, res) => {
  const { fullName, email, username, currentPassword, newPassword, bio, link } =
    req.body;

  let { profileImg, coverImg } = req.body;

  const userId = req.user._id;
  try {
    let user = await User.findById(userId);

    if (!user) return res.status(404).json({ error: "User not found" });

    if ((!newPassword && currentPassword) || (!currentPassword && newPassword))
      return res.status(400).json({
        error: "Please provide both current password and new password"
      });

    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);

      if (!isMatch)
        return res.status(400).json({ error: "Current password is incorrect" });
      if (newPassword.length < 6)
        return res
          .status(400)
          .json({ error: "Password must be longer that 6 characters" });

      const hashPassword = await bcrypt.hash(newPassword, 10);
    }

    if (profileImg) {
      // https://res.cloudinary.com/dyfgon1v6/image/upload/v1712997552/zmxorcxexpdbh8rebkjb.png

      //if user already ahs a profile image delete it
      if (user.profileImg) {
        await cloudinary.uploader.destroy(
          user.profileImg.split("/").pop().split(".")[0]
        );
      }
      const uploadedResponse = await cloudinary.uploader.upload(profileImg);

      profileImg = uploadedResponse.secure_url;
    }

    if (coverImg) {
      if (user.coverImg) {
        await cloudinary.uploader.destroy(
          user.profileImg.split("/").pop().split(".")[0]
        );
      }
      const uploadedResponse = await cloudinary.uploader.upload(coverImg);
      coverImg = uploadedResponse.secure_url;
    }

    //if user passed a field
    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.username = username || user.username;
    user.link = link || user.link;
    user.bio = bio || user.bio;
    user.profileImg = profileImg || user.profileImg;
    user.coverImg = coverImg || user.coverImg;

    user = await user.save();

    user.password = null;

    return res.status(200).json(user);
  } catch (error) {
    console.log("Error in update-profile route:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

export { router as userRoutes };
