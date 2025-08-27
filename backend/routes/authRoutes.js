import express from 'express';
import { oauthGoogle, refresh } from '../controllers/authController.js';

const router = express.Router();

router.post('/google', oauthGoogle);
router.post("/refresh", refresh);

export default router;
