import express from 'express';
import { pollRouter } from './pollRouter.js';

const router = express.Router();

router.use(pollRouter);

export default router;