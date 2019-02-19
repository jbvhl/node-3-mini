require('dotenv').config();
const express = require('express');
const {json} = require('body-parser');
const app = express();
const {SERVER_PORT} = process.env || 3005;
const mc = require('./messagesCTRL');
const session = require('express-session');
const {SESSION_SECRET} = process.env;

app.use(json());
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))

app.use((req, res, next) => {
    const badWords = ['knucklehead', 'jerk', 'internet explorer'];
    if (req.body.message) {
        for (let i = 0; i < badWords.length; i++) {
            let regex = new RegExp(badWords[i], 'g');
            req.body.message = req.body.message.replace(regex, '****');
        }
        next();
    } else {
        next();
    }
});

app.get('/api/messages', mc.getAllMessage);
app.post('/api/messages', mc.createMessage);
app.get('/api/messages/history', mc.history);

app.listen(SERVER_PORT, () => {
    console.log(`Hearing on ${SERVER_PORT}`)
})

