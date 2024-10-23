import { Router } from "express";
import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";
import { generateJWTAndSetCookie } from "../lib/utils/generateTokenandSetCookie.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = Router();

router.post("/signup", async (req, res) => {
  const { username, fullName, email, password } = req.body;

  try {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!username || !fullName || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    //check for valid email address
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    //username
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ error: "Username is already taken" });
    }

    //email
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email is already taken" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 char's long" });
    }
    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      username,
      email,
      password: hashedPassword
    });

    if (newUser) {
      //jwt
      generateJWTAndSetCookie(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        success: true,
        user: { ...newUser._doc, password: undefined }
      });
    } else {
      res.status(201).json({ error: "Invalid user data" });
    }
  } catch (error) {
    console.log(`Error in the signup Route`, error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    //generate jwt
    generateJWTAndSetCookie(user._id, res);

    res
      .status(200)
      .json({ success: true, user: { ...user._doc, password: undefined } });
  } catch (error) {
    console.log(`Error in the Login Route`, error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/logout", async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logout successfully" });
  } catch (error) {
    console.log(`Error in the Logout Route`, error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/me", protectRoute, async (req, res) => {
  try {
    //from the req from protected route
    const user = await User.findById(req.user._id);
    res.status(200).json(user)
  } catch (error) {
    console.log(`Error in the meRoute`, error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

export { router as authRoutes };
