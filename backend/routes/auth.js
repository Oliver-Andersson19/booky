import express from 'express';
import { oauthGoogle } from '../controllers/authController.js';

const router = express.Router();

router.post('/google', oauthGoogle);

export default router;
