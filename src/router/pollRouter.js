import express from "express";
import { getPoll, postPoll } from "../controllers/pollControllers.js";

const pollRouter = express.Router();

pollRouter.post('/poll', postPoll);
pollRouter.get('/poll', getPoll);

export { pollRouter };