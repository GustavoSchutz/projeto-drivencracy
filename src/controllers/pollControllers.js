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
    const today = dayjs(new Date());

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

    if (!dayjs(poll.expireAt).isValid() || dayjs(poll.expireAt).isBefore(today)) {
        console.log(dayjs(poll.expireAt).isValid());
        return res.sendStatus(422);
    }

    const title = poll.title;
    const expireAt = poll.expireAt;

    try {

        await db.collection('polls').insertOne({
            title,
            expireAt
        });

        return res.sendStatus(201);

    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }

};

export async function getPoll(req, res) {
    try {
        const polls = await db.collection('polls').find({}).toArray();
        res.send(polls).status(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
};

export async function getPollChoice(req, res) {

    const id = req.params.id;

    try {
        const poll = await db.collection('choices').find(
            { pollId: id }
        ).toArray();
        res.send(poll).status(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }

};
