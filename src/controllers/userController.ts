import { Response, Request } from 'express';
import Mongo from '../db';
import { checkUser, createPlaylist, createUser } from 'src/dbOps/usersDbOps';
import { collections } from 'src/server';

const db = Mongo.db;

export const isUserExisting = async (req: Request, res: Response) => {
  const { email } = req.body;
  const check = await checkUser(collections.users, email);
  if (!check) return res.status(400).json({ message: 'User not existing' });
};

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await createUser(collections.users, { email, password });
  /**
   * create default playlist
   */
  await createPlaylist(
    collections.playlist,
    { name: 'likes' },
    result.insertedId.toString()
  );
  return res.json(result);
};
