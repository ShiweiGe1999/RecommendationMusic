import express from 'express';
import Mongo from './db';
const app = express();
const port = process.env.PORT || 5000;

app.get('/', (_, res) => {
  res.status(200).send('Hello From world');
});



const boot = async () => {
  await Mongo.main();
  app.listen(port, () => console.log(`Running on port ${port}`));
};

boot();
