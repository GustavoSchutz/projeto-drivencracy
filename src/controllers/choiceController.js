import express from 'express';
import Joi from 'joi';
import { ObjectId } from 'mongodb';




export async function postChoice (req, res) {

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

};
