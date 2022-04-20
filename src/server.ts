import express from 'express';
import Mongo from './db';
import { Collection } from 'mongodb';
import { validateAccount } from './controllers/validationController';
import { Collections } from './types/commonTypes';
const app = express();
const port = process.env.PORT || 5000;
export const collections: Collections = {};

app.get('/', validateAccount, (_, res) => {
  res.status(200).send('Hello From world');
});

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
