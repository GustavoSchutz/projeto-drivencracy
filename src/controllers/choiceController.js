import express from 'express';
import Joi from 'joi';
import { ObjectId } from 'mongodb';
import { db } from '../../index.js';
import dayjs from 'dayjs';


export async function postChoice(req, res) {

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
    const choices = await db.collection('choices').findOne(
        { pollId: choice.pollId , title: choice.title }
    );

    if (choices) {
        return res.sendStatus(409);
    }
    

    const pollId = req.body.pollId;
    const title = req.body.title;

    const polls = await db.collection('polls').findOne(
        { _id: ObjectId(pollId) }
    );

    const today = dayjs(new Date());
    // if (polls.expireAt)
    if (dayjs(polls.expireAt).isBefore(today)) {
        return res.sendStatus(403);
    };

    if (!polls) {
        return res.status(404).send(pollId);
    };

    try {
        const addChoice = await db.collection('choices').insertOne(choice);
        return res.sendStatus(201);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    };

};

export async function postVote(req, res) {
    const id = req.params.id;
    const today = dayjs(new Date());

    const choice = await db.collection('choices').findOne({ _id: ObjectId(id) });

    if (!choice) {
        return res.sendStatus(404);
    };

    const poll = await db.collection('polls').find({ _id: ObjectId(choice.pollId) })

    if (!poll) {
        return res.sendStatus(404);
    };

    if (dayjs(poll.expireAt).isBefore(today)) {
        return res.sendStatus(403);
    };

    try {
        const vote = await db.collection('votes').insertOne({
            choiceId: id,
            title: choice.title,
            date: today.format("YYYY-MM-DD HH:mm")
        });
        return res.sendStatus(201);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}




// export async function postChoice (req, res) {

//     const choice = req.body;

//     const postChoiceSchema = Joi.object({
//         title: Joi.string().required(),
//         pollId: Joi.string().required()
//     });

//     const choiceValidation = postChoiceSchema.validate(choice);

//     if (choiceValidation.error) {
//         console.log(choiceValidation.error.details);
//         return res.sendStatus(422);
//     };

//     const title = req.body.title;
//     const pollId = req.body.pollId;
//     const searchPollId = `ObjectId("${pollId}")`
//     console.log(searchPollId);

//     try {

//         const polls = await db.collection('poll').findOne(
//             { _id: ObjectId(pollId) }
//         );

//         if (!polls) {
//             res.status(404).send(pollId);
//         } 

//         const choices = [];
    
//         for(let i = 0; i < polls.choices?.length; i++) {
//             choices.push(polls.choices[i]);
//         };

//         choices.push({ title });

//         const addChoice = await db.collection('poll').updateOne(
//             { _id: ObjectId(pollId) },
//             {
//                 $set: { choices }
//             }
//         );
//         console.log(polls);
//         res.send(addChoice).status(200);
//     } catch (error) {
//         console.log(error);
//         return res.sendStatus(500);
//     };

// };
