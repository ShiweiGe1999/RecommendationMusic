import { collections } from '../server';
import { Collection, ObjectId, Db } from 'mongodb';
import { Playlist } from '../types/commonTypes';

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

export const getPlaylists = async (
  playlistCollection: Collection,
  userId: string | ObjectId
) => {
  userId = new ObjectId(userId);
  const playlists = await playlistCollection
    .find({ userId })
    .sort({ created_at: 1 });
  return playlists;
};
