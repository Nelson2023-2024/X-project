import { Router } from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { User } from "../models/user.model.js";

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
router.get("/suggested-to-follow", async (req, res) => {});
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
      res.status(200).json({ message: "User unfollowed successfully" });
    } else {
      //follow user
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } }); //add id of user we just followed

      //send notification
      res.status(200).json({ message: "User followed successfully" });
    }
  } catch (error) {
    console.log(`Error in /follow-unfollow/:id route ${error.message}`);
    return res.status(500).json({ error: "Internal server error" });
  }
});
router.post("/update-profile", async (req, res) => {});

export { router as userRoutes };
