import { Collection, ObjectId } from 'mongodb';
import { Playlist } from '../types/commonTypes';
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

export const getPlaylistSongs = async (
  songsCollection: Collection,
  playlistCollection: Collection,
  userId: string,
  playlistId: string
) => {
  const playlist = await playlistCollection.findOne({
    _id: new ObjectId(playlistId),
  });
  // find all songs
  const songs = await songsCollection
    .find({ playlistId: playlist._id })
    .sort({ created_at: 1 });
  return songs;
};
