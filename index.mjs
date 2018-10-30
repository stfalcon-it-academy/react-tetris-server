import express from 'express';
import fs from 'fs';
import cors from 'cors';
import bodyParser from 'body-parser';
import find from 'lodash/find';

const PORT = 3001;
const LEADERBOARD = './leaderboard.json';
const GAMES = './games.json';
const app = express();

const generateId = () =>
  `id-${+new Date()}-${Math.random()
    .toString(36)
    .substr(2, 9)}`;

app.use(
  cors({
    origin: 'http://localhost:3010',
    optionsSuccessStatus: 200,
  }),
);
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('ok');
});

app.get('/leaderboard', (req, res) => {
  let toSend;
  if (fs.existsSync(LEADERBOARD)) {
    const leaderboard = fs.readFileSync(LEADERBOARD);
    toSend = leaderboard.toString();
  } else {
    toSend = [];
  }
  setTimeout(() => res.send(toSend), 1000);
});

app.post('/leaderboard', (req, res) => {
  let leaderboard;
  const id = generateId();
  if (fs.existsSync(LEADERBOARD)) {
    leaderboard = JSON.parse(fs.readFileSync(LEADERBOARD).toString());
  } else {
    leaderboard = [];
  }
  fs.writeFileSync(
    LEADERBOARD,
    JSON.stringify([
      ...leaderboard,
      {
        ...req.body,
        finished: +new Date(),
        id,
      },
    ]),
  );
  setTimeout(() => res.send(id), 2000);
});

app.get('/games', (req, res) => {
  let toSend;
  if (fs.existsSync(GAMES)) {
    const games = fs.readFileSync(GAMES);
    toSend = games.toString();
  } else {
    toSend = null;
  }
  setTimeout(() => res.send(toSend), 2000);
});

app.get('/game', (req, res) => {
  let toSend;
  const { id } = req.query;
  if (id && fs.existsSync(GAMES)) {
    const games = JSON.parse(fs.readFileSync(GAMES).toString());
    toSend = find(games, { id });
  } else {
    toSend = null;
  }
  setTimeout(() => {
    if (toSend) {
      res.send(toSend);
    } else {
      res.status(404).send('Not Found');
    }
  }, 2000);
});

app.post('/game', (req, res) => {
  let games;
  const id = generateId();
  if (fs.existsSync(GAMES)) {
    games = JSON.parse(fs.readFileSync(GAMES).toString());
  } else {
    games = [];
  }
  fs.writeFileSync(
    GAMES,
    JSON.stringify([
      ...games,
      {
        ...req.body,
        saved: +new Date(),
        id,
      },
    ]),
  );
  setTimeout(() => res.send(id), 2000);
});

console.log(`listening on port ${3001}`);
app.listen(PORT);
