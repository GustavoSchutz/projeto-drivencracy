import express from "express";
import { postChoice } from "../controllers/choiceController";

const choiceRouter = express.Router();

choiceRouter.post("/choice", postChoice);

export { choiceRouter };