import { Collection, ObjectId } from 'mongodb';
import { Playlist, Song } from '../types/commonTypes';
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

export const getMyAllSongs = async (
  songsCollection: Collection,
  playlistCollection: Collection,
  userId: ObjectId | string
) => {
  // find all the playlist
  const playlistArr = await playlistCollection
    .find({ userId: new ObjectId(userId) })
    .toArray();
  const newArr = playlistArr.map((v) => v._id);
  // find all songs
  const songsArr = await songsCollection
    .find({
      playlistId: {
        $in: newArr,
      },
    })
    .sort({
      created_at: -1,
    })
    .toArray();
  return songsArr;
};

export const getLatestLikedSong = async (
  songsCollection: Collection,
  playlistCollection: Collection,
  userId: ObjectId | string
) => {
  // get my all songs
  const songs: any[] = await getMyAllSongs(
    songsCollection,
    playlistCollection,
    userId
  );
  return songs[0];
};

export const clearRecommendation = async (
  recommendationCol: Collection,
  userId: string | ObjectId
) => {
  return await recommendationCol.deleteMany({});
};

export const insertRecommendation = async (
  recommendationCol: Collection,
  songs: Song[] | any[]
) => {
  return await recommendationCol.insertMany(songs);
};

export const getMyRecommendation = async (
  recomendationCol: Collection,
  userId: string | ObjectId
) => {
  const songs = await recomendationCol
    .find({ userId: new ObjectId(userId) })
    .toArray();
  return songs;
};
