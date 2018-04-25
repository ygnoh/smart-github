const express = require("express");
const firebase = require("@firebase/app").default;
require("@firebase/messaging");

const app = express();
const PORT = 3000;

app.post("/watch", (req, res, next) => {
    let payload = "";

    req.on("readable", () => {
        const read = req.read();
        if (!read) {
            return;
        }

        payload += read;
    });

    req.on("end", () => {
        try {
            const {comment} = JSON.parse(payload);
            const {html_url, user, body} = comment;

            console.log(`${user.login}가 당신의 글(${html_url})에 댓글을 달았습니다:\n${body}`);
        } catch (e) {
            console.error(e);
        }
    });
});

app.listen(PORT, () => console.log(`\nStart to listen on port ${PORT}.\n`));

// init firebase
const config = {
    apiKey: "AIzaSyD7maFJ1fc_lGPQev9Jiyse53AgtCybpJg",
    authDomain: "smart-github.firebaseapp.com",
    databaseURL: "https://smart-github.firebaseio.com",
    projectId: "smart-github",
    storageBucket: "smart-github.appspot.com",
    messagingSenderId: "767779176892"
};
firebase.initializeApp(config);