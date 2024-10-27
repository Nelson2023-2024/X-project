import { Router } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import { protectRoute } from '../middleware/protectRoute.js';
import { Post } from '../models/post.model.js';
import { User } from '../models/user.model.js';
import { Notification } from '../models/notification.model.js';

const router = Router();

router.use(protectRoute);

router.get('/all-posts', async (req, res) => {
  try {
    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .populate({
        path: 'user',
        select: '-password',
      })
      .populate({
        path: 'comments.user',
        select: '-password',
      });

    if (posts.length === 0) return res.status(200).json([]);

    //if the length is greater than 0
    res.status(200).json(posts);
  } catch (error) {
    console.log(`Error in create Post Route:`, error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.get('/liked-posts/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ error: 'User not found' });

    const likedposts = await Post.find({
      _id: { $in: user.likedposts },
    })
      .populate({
        path: 'user',
        select: '-password',
      })
      .populate({
        path: 'comments.user',
        select: '-password',
      });

    if (likedposts.length < 1)
      return res.status(200).json({ message: `No liked posts by ${userId}` });

    res.status(200).json({ likedposts });
  } catch (error) {
    console.log(`Error in liked-post:`, error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.post('/create', async (req, res) => {
  try {
    let { text } = req.body;
    let { img } = req.body;

    const userId = req.user._id.toString();

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (!text && !img)
      return res.status(400).json({ error: 'Post must have text or image' });

    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secure_url;
    }

    const newPost = new Post({
      user: userId,
      text,
      img,
    });

    await newPost.save();
    res.status(201).json({ message: 'Post created successfull', newPost });
  } catch (error) {
    console.log(`Error in create Post Route:`, error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.post('/like-unlike/:id', async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ error: 'Post not found' });

    const userLikedPost = post.likes.includes(userId);

    //if user already liked the post unlike it
    if (userLikedPost) {
      //unlike
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      await User.updateOne({ _id: userId }, { $pull: { likedposts: postId } });
      res.status(200).json({ message: 'Post unliked sucessfully' });
    } else {
      //like
      post.likes.push(userId);
      await User.updateOne({ _id: userId }, { $push: { likedposts: postId } });
      await post.save();

      //send notification
      const notification = new Notification({
        from: userId,
        to: post.user,
        type: 'like',
      });
      await notification.save();

      res.status(200).json({ message: 'Post liked succesffuly', post });
    }
  } catch (error) {
    console.log('Error in like-unlike controller', error);
    res.sendStatus(500);
  }
});
router.post('/comment/:postId', async (req, res) => {
  try {
    const { text } = req.body;
    const { postId } = req.params;

    const userId = req.user._id;

    if (!text) return res.status(400).json({ error: 'Text field is required' });

    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ error: 'Post not found' });

    const comment = { user: userId, text };

    post.comments.push(comment);
    await post.save();

    res.status(201).json(post);
  } catch (error) {
    console.log('Error in deletePost', error);
    res.sendStatus(500);
  }
});
router.delete('/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ error: 'Post not found' });

    //check if we are the owner of the post
    if (post.user.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ error: 'You are not authorized to delete this post' });
    }

    //if post has an image delete it from cloudinary
    if (post.img) {
      const imgId = post.img.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(imgId);
    }

    await Post.findByIdAndDelete(postId);

    res.status(200).json({ message: 'Post deleted successfully', post });
  } catch (error) {
    console.log('Error in deletePost', error);
    res.sendStatus(500);
  }
});
export { router as postRoutes };
