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
        if ((!username || !avatar) ||
            (username.toString() !== username || avatar.toString() !== avatar))
            return res.status(400).send("Todos os campos são obrigatórios!");

        users.push({ username, avatar });
        res.status(201).send("OK");
    } catch (error) {
        res.status(500).send("Houve um problema no registro, por favor tente novamente.");
    }
});

app.post("/tweets", (req, res) => {
    const { tweet } = req.body;
    const { user } = req.headers;

    if (!users.find(p => p.username == user)) return res.status(401).send("UNAUTHORIZED");
    if (!tweet || tweet.toString() !== tweet) return res.status(400).send("Todos os campos são obrigatórios!");

    try {
        if (!user || !tweet) return res.status(400).send("Todos os campos são obrigatórios!");
        tweets.unshift({ username: user, tweet });
        res.status(201).send("OK");
    } catch (error) {
        res.status(500).send("Houve um problema interno, por favor tente novamente.");
    }
});

app.get("/tweets", (req, res) => {
    const { page } = req.query;
    let start = 0, end = 10;
    if (page) {
        if (page >= 1) {
            end = Math.floor(page) * 10;
            start = end - 10;
        } else {
            res.status(400).send("Informe uma página válida!");
        }
    }
    try {
        const tweetsInfo = tweets.map(tweet => ({
            ...tweet,
            avatar: users.find(user => user.username == tweet.username).avatar,
        }));
        if (tweetsInfo.length > 10) {
            res.status(200).send(tweetsInfo.slice(start, end));
        } else {
            res.status(200).send(tweetsInfo);
        }
    } catch (error) {
        res.status(500).send("Houve um problema interno, por favor tente novamente.");
    }
});

app.get("/tweets/:username", (req, res) => {
    const { username } = req.params;
    try {
        const user = users.find(user => user.username == username);
        let tweetInfo = [];
        if (user) {
            tweetInfo = tweets
                .filter(tweet => tweet.username == username)
                .map(tweet => ({
                    ...tweet,
                    avatar: users.find(user => user.username == username).avatar
                }));
        }
        res.status(200).send(tweetInfo);
    } catch (error) {
        res.status(500).send("Houve um problema interno, por favor tente novamente.");
    }
});