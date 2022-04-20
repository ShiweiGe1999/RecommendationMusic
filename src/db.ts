import { MongoClient, ServerApiVersion, Db } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config({ path: `${__dirname}/../.env` });


class Mongo {
  client: MongoClient;
  db: Db;
  constructor() {
    this.client = new MongoClient(process.env.MONGO_URL);
  }
  async main() {
    await this.client.connect();
    console.log('Connected to DataBase');
    this.db = this.client.db();
  }
}
export default new Mongo();
