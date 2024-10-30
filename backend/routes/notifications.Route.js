import { Router } from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { Notification } from '../models/notification.model.js';

const router = Router();

router.use(protectRoute);

router.get('/', async (req, res) => {
  try {
    const userId = req.user._id;

    const notifications = await Notification.find({ to: userId }).populate({
      path: 'from',
      select: 'username profileImg',
    });

    //i
    await Notification.updateMany({ to: userId }, { read: true });

    res.status(200).json(notifications);
  } catch (error) {
    console.log('Error in getNotifications function', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.delete('/', async (req, res) => {
  try {
    const userId = req.user._id;

    //delete all notifications sent to the user
    await Notification.deleteMany({ to: userId });

    res.status(200).json({ message: 'Notifications deleted successfully' });
  } catch (error) {
    console.log('Error in deleteNotifications controller', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const notificationId = req.params.id;
    const userId = req.user._id;

    const notification = await Notification.findById(notificationId);

    if (!Notification)
      return res.status(404).json({ error: 'Notification not found' });

    if (notification.to.toString() !== user.toString())
      return res
        .status(401)
        .json({ error: 'Tou are not allowed to delete this post' });

    await Notification.findByIdAndDelete(notificationId);
    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.log('Error in delete:/id notification Route', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});
export { router as notificationsRoutes };
