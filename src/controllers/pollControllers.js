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

    const polls = await db.collection('polls').findOne(
        { _id: ObjectId(id) }
    );
    if (!polls) {
        return res.sendStatus(404);
    }

    try {
        const choices = await db.collection('choices').find(
            { pollId: id }
        ).toArray();
        res.send(choices).status(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }

};

export async function getResults(req, res) {

    const id = req.params.id;

    try {
        const poll = await db.collection('polls').findOne(
            { _id: ObjectId( id )}
        );
        console.log(poll);
        if (!poll) {
            return res.sendStatus(404);
        }
        const pollTitle = poll.title;
        const pollExpireAt = poll.expireAt;
    
        const choices = await db.collection('choices').find(
            { pollId: id }
        ).toArray();

        let choicesIds = [];

        for(let i = 0; i < choices.length; i++) {
            console.log((choices[i]._id).toString());
            choicesIds.push((choices[i]._id).toString());
        }
        console.log(choicesIds);

        let mostVoted = 0;
        let mostVotedId;
        let totalOfVotes;
        for(let i = 0; i < choicesIds.length; i++) {
            const votesAmount = await db.collection('votes').find(
                { choiceId: choicesIds[i] }
            ).toArray();
            console.log(votesAmount.length);

            if (votesAmount.length > mostVoted) {
                mostVotedId = choicesIds[i];
                totalOfVotes = votesAmount.length;
            };
        }

        console.log(choices[choicesIds.indexOf(mostVotedId)].title, totalOfVotes);
        
        return res.send({_id: id, title: pollTitle, expireAt: pollExpireAt, result: {
            title: choices[choicesIds.indexOf(mostVotedId)].title, votes: totalOfVotes
        }}).status(200);
        
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}
