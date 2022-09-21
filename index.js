import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient } from "mongodb";
import Joi from "joi";
import dayjs from "dayjs";

const app = express();

app.use(cors());
app.use(express.json());
dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;

mongoClient.connect().then(() => {
    db = mongoClient.db("drivencracy");
}).catch(() => console.log(error));

app.post("/poll", async (req, res) => {

    const postPollSchema = Joi.object({
        title: Joi.string().required(),
        expireAt: Joi.string().required()
    });
    
    const poll = req.body;
    const pollValidation = postPollSchema.validate(poll);

   



    const title = req.body.title;
    const expireAt = req.body.expireAt;

})