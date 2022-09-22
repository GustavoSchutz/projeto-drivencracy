import Joi from "joi";
import { db } from "../../index.js";
import { ObjectId } from "mongodb";
import dayjs from "dayjs";

export async function postPoll(req, res) {

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

};

export async function getPoll(req, res) {
    try {
        const polls = await db.collection('poll').find({}).toArray();
        res.send(polls).status(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
};
