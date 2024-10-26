import { Router } from "express";
import { v2 as cloudinary } from "cloudinary";
import { protectRoute } from "../middleware/protectRoute.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";

const router = Router();

router.use(protectRoute);

router.post("/create", async (req, res) => {
  try {
    let { text } = req.body;
    let { img } = req.body;

    const userId = req.user._id.toString();

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    if (!text && !img)
      return res.status(400).json({ error: "Post must have text or image" });

    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secure_url;
    }

    const newPost = new Post({
      user: userId,
      text,
      img
    });

    await newPost.save();
    res.status(201).json({ message: "Post created successfull", newPost });
  } catch (error) {
    console.log(`Error in create Post Route:`, error.message);
    res.sendStatus(500);
  }
});
router.post("/like-unlike/:id", async (req, res) => {});
router.post("/comment/:postId", async (req, res) => {
  try {
    const { text } = req.body;
    const { postId } = req.params;

    const userId = req.user._id;

    if (!text) return res.status(400).json({ error: "Text field is required" });

    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ error: "Post not found" });

    const comment = { user: userId, text };

    post.comments.push(comment);
    await post.save();

    res.status(201).json(post);
  } catch (error) {
    console.log("Error in deletePost", error);
    res.sendStatus(500);
  }
});
router.delete("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ error: "Post not found" });

    //check if we are the owner of the post
    if (post.user.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ error: "You are not authorized to delete this post" });
    }

    //if post has an image delete it from cloudinary
    if (post.img) {
      const imgId = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }

    await Post.findByIdAndDelete(postId);

    res.status(200).json({ message: "Post deleted successfully", post });
  } catch (error) {
    console.log("Error in deletePost", error);
    res.sendStatus(500);
  }
});
export { router as postRoutes };
