import { collections } from 'src/server';
import { Collection, ObjectId, Db } from 'mongodb';
import bcrypt from 'bcrypt';
import { UserInfo, Playlist, Song } from 'src/types/commonTypes';

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

export const deletePlaylist = async (
  playlistCollection: Collection,
  playlistId: string
) => {
  const result = await playlistCollection.deleteOne({
    _id: new ObjectId(playlistId),
  });
  return result;
};

export const createPlaylist = async (
  playlistCollection: Collection,
  playlistInfo: Playlist,
  userId: string
) => {
  // check if the user has the same playlist;
  const user = new ObjectId(userId);
  const { name } = playlistInfo;
  const check = await playlistCollection.findOne({ userId: user, name });
  if (check) throw new Error('playlist already exists');
  // create
  const result = await playlistCollection.insertOne({
    name,
    userId: user,
    created_at: new Date(),
  });
  return result;
};

export const addSongs = async (songsCollection: Collection, songs: any[]) => {
  songs = songs.map((v) => {
    return {
      ...v,
      created_at: new Date(),
    };
  });
  const result = await songsCollection.insertMany(songs);
  return result;
};

export const deleteSongs = async (
  songsCollection: Collection,
  songs: string[] | ObjectId[]
) => {
  songs = songs.map((v) => new ObjectId(v));
  const result = await songsCollection.deleteMany({ _id: { $in: songs } });
  return result;
};
