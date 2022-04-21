import { Response, Request, NextFunction } from 'express';
import Mongo from '../db';
import { collections } from '../server';
import { createPlaylist } from '../dbOps/playlistDbOps';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { checkUser, createUser } from '../dbOps/usersDbOps';
import passport from 'passport';
import dotenv from 'dotenv';

dotenv.config({ path: `${__dirname}/../../.env` });

export const isUserExisting = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;
    const check = await checkUser(collections.users, email);
    if (!check) return res.status(400).json({ message: 'User not existing' });
    next();
  } catch (err) {
    return res.status(404).json({ message: 'User not found' });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await createUser(collections.users, { email, password });
    /**
     * create default playlist
     */
    await createPlaylist(
      collections.playlist,
      { name: 'likes' },
      result.insertedId,
      true
    );
    return res.json(result);
  } catch (err) {
    return res.status(400).json({ message: 'Register wrong' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await collections.users.findOne<any>({ email });
    if (!user) return res.status(404).json({ message: 'user not found' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Unauthorized' });
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token: `Bearer ${token}` });
  } catch (err) {
    return res.status(400).json({ message: 'login malfunction' });
  }
};

export const authenticate = passport.authenticate('jwt', { session: false });
