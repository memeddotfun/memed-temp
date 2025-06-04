import express from 'express';
import {
  addWaitlist,
  confirmWaitlist
} from '../controllers/waitlistController';
import { asyncRoute } from '../utils/routeUtils';

const router = express.Router();

router.post('/add', asyncRoute(addWaitlist));
router.post('/confirm', asyncRoute(confirmWaitlist));

export default router;
