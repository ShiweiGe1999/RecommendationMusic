import { collections } from '../server';
import { Collection, ObjectId, Db } from 'mongodb';
import bcrypt from 'bcrypt';
import { UserInfo } from '../types/commonTypes';

const saltRounds = 10;

export const checkUser = async (
  usercollection: Collection,
  email: string
): Promise<boolean> => {
  const user = await usercollection.findOne({ email });
  if (!user) return false;
  return true;
};

export const createUser = async (
  userCollection: Collection,
  userInfo: UserInfo
) => {
  const { email, password } = userInfo;
  const hash = await bcrypt.hash(password, saltRounds);
  const result = await userCollection.insertOne({
    email,
    password: hash,
    last_recommended_at: -1,
    created_at: new Date(),
  });
  return result;
};
