import express from 'express';
import Mongo from './db';
import { Collections } from './types/commonTypes';
import { login, isUserExisting, register } from './controllers/userController';
import { validateAccount } from './controllers/validationController';
import passport from 'passport';
import configPassport from './auth';
import { authenticate } from './controllers/userController';
import securedRouter from './securedRouter';
import cors from 'cors';
import {
  getAudioStream,
  getInfo,
  checkRecommendation,
  apiRecommend,
} from './controllers/mediaController';
import { checkShouldUpdate } from './dbOps/usersDbOps';

const app = express();
const port = process.env.PORT || 5000;
export const collections: Collections = {};
app.use(express.static(`${__dirname}/../client/build`));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
configPassport(passport);
app.use('/api/user', authenticate, securedRouter);
app.post('/api/login', validateAccount, isUserExisting, login);
app.post('/api/register', validateAccount, isUserExisting, register);
app.get('/api/stream/:videoId', getAudioStream);
app.get('/api/getinfo', getInfo);
app.get('*', (req, res) => {
  res.sendFile(`${__dirname}/../client/build/index.html`);
});

app.post('/api/recommend', apiRecommend);
const boot = async () => {
  await Mongo.main();
  // contruct our collections
  collections.users = Mongo.db.collection('users');
  collections.playlist = Mongo.db.collection('playlist');
  collections.recommended_songs = Mongo.db.collection('recommended_songs');
  collections.songs = Mongo.db.collection('songs');
  app.listen(port, () => console.log(`Running on port ${port}`));
};

boot();
