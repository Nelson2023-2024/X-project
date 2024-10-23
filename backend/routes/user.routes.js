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
router.post("/follow/:id", async (req, res) => {});
router.post("/update-profile", async (req, res) => {});

export { router as userRoutes };
