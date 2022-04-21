import { collections } from '../server';
import { Collection, ObjectId, Db } from 'mongodb';
import { Playlist } from '../types/commonTypes';

export const deletePlaylist = async (
  playlistCollection: Collection,
  playlistId: string | ObjectId,
  userId: string | ObjectId
) => {
  const result = await playlistCollection.findOneAndDelete({
    _id: new ObjectId(playlistId),
    userId,
    isDefault: false,
  });
  return result;
};

export const createPlaylist = async (
  playlistCollection: Collection,
  playlistInfo: Playlist,
  userId: string | ObjectId,
  isDefault: boolean = false
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
    isDefault,
  });
  return result;
};

export const getPlaylists = async (
  playlistCollection: Collection,
  userId: ObjectId | string
) => {
  userId = new ObjectId(userId);
  const playlists = await playlistCollection
    .find({ userId })
    .sort({ created_at: 1 })
    .toArray();
  return playlists;
};
