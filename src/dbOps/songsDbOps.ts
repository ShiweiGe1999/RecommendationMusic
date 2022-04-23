import { Collection, ObjectId } from 'mongodb';
import { Playlist } from '../types/commonTypes';
export const addSongs = async (
  songsCollection: Collection,
  songs: any[],
  playlistId: string | ObjectId
) => {
  songs = songs.map((v) => {
    return {
      ...v,
      playlistId: new ObjectId(playlistId),
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

export const getPlaylistSongs = async (
  songsCollection: Collection,
  playlistId: string | ObjectId
) => {
  // find all songs
  const songs = await songsCollection
    .find({ playlistId: new ObjectId(playlistId) })
    .sort({ created_at: 1 })
    .toArray();
  return songs;
};
