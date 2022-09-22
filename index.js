import express, { Router } from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient } from "mongodb";
import Joi from "joi";
import dayjs from "dayjs";
import { ObjectId } from "mongodb";
import router from "./src/router/router.js";

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

app.get("/status", (req, res) => {
    res.send("ok").status(200);
})

app.use(router);



app.listen(process.env.PORT, () => console.log(`Magic happens on ${process.env.PORT}`));