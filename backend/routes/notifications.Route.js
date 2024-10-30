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
  } catch (error) {
    console.log('Error in deleteNotifications controller', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as notificationsRoutes };
