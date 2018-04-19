const express = require("express");
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
        const {comment} = JSON.parse(payload);
        const {html_url, user, body} = comment;

        console.log(`${user.login}가 당신의 글(${html_url})에 댓글을 달았습니다:\n${body}`);
    });
});

app.listen(PORT, () => console.log(`\nStart to listen on port ${PORT}.\n`));