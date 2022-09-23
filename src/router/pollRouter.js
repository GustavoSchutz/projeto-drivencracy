import express from "express";
import { getPoll, getPollChoice, postPoll } from "../controllers/pollControllers.js";

const pollRouter = express.Router();

pollRouter.post('/poll', postPoll);
pollRouter.get('/poll', getPoll);
pollRouter.get('/poll/:id/choice', getPollChoice);

export { pollRouter };