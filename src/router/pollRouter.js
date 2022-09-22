import express from "express";
import { postPoll } from "../controllers/pollControllers";

const pollRouter = express.Router();

pollRouter.post('/poll', postPoll);

export { pollRouter };