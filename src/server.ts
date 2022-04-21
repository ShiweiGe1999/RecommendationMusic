import express from 'express';
import Mongo from './db';
import { Collections } from './types/commonTypes';
import { login, isUserExisting } from './controllers/userController';
import { validateAccount } from './controllers/validationController';
import passport from 'passport';
import configPassport from './auth';
const app = express();
const port = process.env.PORT || 5000;
export const collections: Collections = {};

app.use(express.json());
app.use(express.urlencoded());
app.use(passport.initialize());
configPassport(passport);

app.post('/api/login', validateAccount, isUserExisting, login);

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
