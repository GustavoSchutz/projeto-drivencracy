import express, { Router } from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient } from "mongodb";
import Joi from "joi";
import dayjs from "dayjs";
import { ObjectId } from "mongodb";


const app = express();

app.use(cors());
app.use(express.json());
dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI);
export let db;

mongoClient.connect()
    .then(() => {
        db = mongoClient.db("drivencracy");
        console.log("MongoClient running")
})
.catch(() => console.log(error));

app.post("/poll", async (req, res) => {

    const postPollSchema = Joi.object({
        title: Joi.string().required(),
        expireAt: Joi.string().allow("").required()
    });

    const poll = req.body;
    const pollValidation = postPollSchema.validate(poll);

    if (pollValidation.error) {
        console.log(pollValidation.error.details);
        return res.sendStatus(422);
    };

    if (poll.expireAt == "") {
        // const newExpireAt = dayjs().format('yyyy-MM-dd HH:mm')
        const newExpireAt = dayjs()
            .add(30, 'd')
            .format("YYYY-MM-DD HH:mm");
        poll.expireAt = `${newExpireAt}`;
        console.log(poll.expireAt);
    }

    const title = poll.title;
    const expireAt = poll.expireAt;

    try {

        await db.collection('poll').insertOne({
            title,
            expireAt
        });

    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }


    res.sendStatus(201);

});

app.get("/poll", async (req, res) => {
    try {
        const polls = await db.collection('poll').find({}).toArray();
        res.send(polls).status(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

app.post("/choice", async (req, res) => {

    const choice = req.body;

    const postChoiceSchema = Joi.object({
        title: Joi.string().required(),
        pollId: Joi.string().required()
    });

    const choiceValidation = postChoiceSchema.validate(choice);

    if (choiceValidation.error) {
        console.log(choiceValidation.error.details);
        return res.sendStatus(422);
    };

    const title = req.body.title;
    const pollId = req.body.pollId;
    const searchPollId = `ObjectId("${pollId}")`
    console.log(searchPollId);

    try {

        const polls = await db.collection('poll').findOne(
            { _id: ObjectId(pollId) }
        );

        if (!polls) {
            res.status(404).send(pollId);
        } 

        const choices = [];
    
        for(let i = 0; i < polls.choices?.length; i++) {
            choices.push(polls.choices[i]);
        };

        choices.push({ title });

        const addChoice = await db.collection('poll').updateOne(
            { _id: ObjectId(pollId) },
            {
                $set: { choices }
            }
        );
        console.log(polls);
        res.send(addChoice).status(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    };

});



app.listen(process.env.PORT, () => console.log(`Magic happens on ${process.env.PORT}`));