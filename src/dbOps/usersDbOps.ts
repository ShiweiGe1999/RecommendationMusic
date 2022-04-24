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

export const updateRecommendationTime = async (
  userCollection: Collection,
  userId: ObjectId | string
) => {
  return await userCollection.updateOne(
    { _id: new ObjectId(userId) },
    {
      $set: {
        last_recommended_at: new Date(),
      },
    }
  );
};

export const checkShouldUpdate = async (
  userCollection: Collection,
  userId: ObjectId | string
): Promise<boolean> => {
  const user = await userCollection.findOne<UserInfo>({
    _id: new ObjectId(userId),
  });
  if (user.last_recommended_at === -1) return true;
  // check if one day passed
  if ( 60 * 60 * 1000 > Date.now() - user.last_recommended_at.getTime())
    return false;
  return true;
};
