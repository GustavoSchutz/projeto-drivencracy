import express from 'express';
import { choiceRouter } from './choiceRouter.js';
import { pollRouter } from './pollRouter.js';

const router = express.Router();

router.use(pollRouter);
router.use(choiceRouter);

export default router