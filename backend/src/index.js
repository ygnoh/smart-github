const express = require("express");
const request = require("request");
const {google} = require("googleapis");

const app = express();
const PORT = 3000;

let accessToken;
getAccessToken().then(token => accessToken = token);

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

            request.post({
                url: "https://fcm.googleapis.com/v1/projects/smart-github/messages:send",
                json: true,
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                },
                body: {
                    message: {
                        token: "", // TODO: 타겟 앱 인스턴스 등록 토큰
                        notification: {
                            body: "this is body",
                            title: "this is title"
                        }
                    }
                }
            }, function(error, incomingMessage, response) {
                console.log(error);
            });
        } catch (e) {
            console.error(e);
        }
    });
});

app.listen(PORT, () => console.log(`\nStart to listen on port ${PORT}.\n`));

function getAccessToken() {
    return new Promise(function (resolve, reject) {
        // the private key to get an access token
        const key = require('../firebase-key.json');
        const jwtClient = new google.auth.JWT(
            key.client_email,
            null,
            key.private_key,
            ["https://www.googleapis.com/auth/firebase.messaging"],
            null
        );
        jwtClient.authorize(function (err, tokens) {
            if (err) {
                reject(err);
                return;
            }
            resolve(tokens.access_token);
        });
    });
}