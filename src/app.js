import express, { json } from "express";
import cors from "cors";

import { users, tweets } from "./data.js";

const PORT = 5000;
const app = express();
app.use(json());
app.use(cors());

app.listen(PORT, () => console.log(`Server on - PORT: ${PORT}`));

app.post("/sign-up", (req, res) => {
    const { body: { username, avatar } } = req;
    try {
        const newUser = { username, avatar }
        users.push(newUser);
        res.send("OK");
    } catch (error) {
        res.status(500).send("Houve um problema no registro, por favor tente novamente.");
    }
});

app.post("/tweets", (req, res) => {
    const { body: { username, tweet } } = req;
    if (!users.find(user => user.username == username)) return res.status(401).send("UNAUTHORIZED");

    try {
        tweets.push({ username, tweet });
        res.status(201).send("OK");
    } catch (error) {
        res.status(500).send("Houve um problema interno, por favor tente novamente.");
    }
});

app.get("/tweets", (req, res) => {
    try {
        const tweetsInfo = tweets.map(tweet => ({
            ...tweet,
            avatar: users.find(user => user.username == tweet.username).avatar,
        }));

        if (tweetsInfo.length > 10) {
            res.status(200).send(tweetsInfo.slice(0, 10));
        } else {
            res.status(200).send(tweetsInfo);
        }
    } catch (error) {
        res.status(500).send("Houve um problema interno, por favor tente novamente.");
    }
});

