import { collections } from '../server';
import {
  getPlaylists,
  deletePlaylist,
  createPlaylist,
} from '../dbOps/playlistDbOps';
import {
  getPlaylistSongs,
  addSongs,
  deleteSongs,
  clearRecommendation,
  insertRecommendation,
  getLatestLikedSong,
  getMyRecommendation,
} from '../dbOps/songsDbOps';
import { Response, Request, NextFunction } from 'express';
import ytdl from 'ytdl-core';
import {
  checkShouldUpdate,
  updateRecommendationTime,
} from '../dbOps/usersDbOps';
import { getRecommendedSongs } from '../search';

/**
 *
 * Playlist Controllers
 */

export const getMyPlaylists = async (req: Request, res: Response) => {
  try {
    const { _id } = req.user as any;
    const result = await getPlaylists(collections.playlist, _id);
    return res.json(result);
  } catch (err) {
    return res.status(400).json({ message: 'Can not get playlist' });
  }
};

export const deleteMyPlaylist = async (req: Request, res: Response) => {
  try {
    const { _id } = req.user as any;
    const { id: playlistId } = req.params;
    const result = await deletePlaylist(collections.playlist, playlistId, _id);
    return res.json(result);
  } catch (err) {
    return res.status(400).json({ message: 'Delete Failed' });
  }
};

export const createMyPlaylist = async (req: Request, res: Response) => {
  try {
    const { _id } = req.user as any;
    const { name } = req.body;
    const result = await createPlaylist(collections.playlist, { name }, _id);
    return res.json(result);
  } catch (err) {
    return res.status(400).json({ message: 'create failed' });
  }
};

/**
 * Songs controllers
 */

export const getMyPlaylistSongs = async (req: Request, res: Response) => {
  try {
    const { playlistId } = req.params;
    const songs = await getPlaylistSongs(collections.songs, playlistId);
    return res.json(songs);
  } catch (err) {
    return res.status(400).json({ message: 'get songs failed' });
  }
};

export const addMySongs = async (req: Request, res: Response) => {
  try {
    const { playlistId, songs } = req.body;
    const result = await addSongs(collections.songs, songs, playlistId);
    return res.json(result);
  } catch (err) {
    return res.status(400).json({ message: 'add failed' });
  }
};

export const deleteMySongs = async (req: Request, res: Response) => {
  try {
    const { songs } = req.body;
    const result = await deleteSongs(collections.songs, songs);
    return res.json(result);
  } catch (err) {
    return res.status(400).json({ message: 'delete failed' });
  }
};
export const getInfo = async (req: Request, res: Response) => {
  try {
    const { url }: any = req.query;
    const videoId = ytdl.getURLVideoID(url);

    const videoInfo = await ytdl.getInfo(videoId);
    const { thumbnails, author, title } = videoInfo.videoDetails;

    return res.status(200).json({
      success: true,
      data: {
        thumbnail: thumbnails[0].url || null,
        videoId,
        author: author ? author['name'] : null,
        title,
      },
    });
  } catch (error) {
    console.log(`error --->`, error);
    return res
      .status(500)
      .json({ success: false, msg: 'Failed to get video info' });
  }
};

export const checkRecommendation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { _id } = req.user as any;
    const shouldUpdate = await checkShouldUpdate(collections.users, _id);
    if (shouldUpdate) {
      // get latest liked song
      const song: any = await getLatestLikedSong(
        collections.songs,
        collections.playlist,
        _id
      );
      // get new recommendation songs
      let songs: any = await getRecommendedSongs(song.title);
      songs = songs.map((v: any) => {
        return {
          ...v,
          userId: _id,
        };
      });
      await clearRecommendation(collections.recommended_songs, _id);
      // insert new recommendation
      await insertRecommendation(collections.recommended_songs, songs);
      // update time
      await updateRecommendationTime(collections.users, _id);
    }
    next();
  } catch (err) {
    return res.status(400).json({ message: 'Check failed' });
  }
};

export const apiRecommend = async (req: Request, res: Response) => {
  try {
    const { song } = req.body;
    const songs = await getRecommendedSongs(song);
    return res.json(songs);
  } catch (err) {
    return res.status(400).json({ message: 'bad recommend' });
  }
};

export const getRecommendation = async (req: Request, res: Response) => {
  try {
    const { _id } = req.user as any;
    const songs = await getMyRecommendation(collections.recommended_songs, _id);
    return res.json(songs);
  } catch (err) {
    return res.status(400).json({ message: 'Recommendation failed' });
  }
};

export const getAudioStream = async (req: Request, res: Response) => {
  try {
    const { videoId } = req.params;
    const isValid = ytdl.validateID(videoId);

    if (!isValid) {
      throw new Error();
    }

    const videoInfo = await ytdl.getInfo(videoId);
    let audioFormat = ytdl.chooseFormat(videoInfo.formats, {
      filter: 'audioonly',
      quality: 'highestaudio',
    });

    const { itag, container, contentLength }: any = audioFormat;

    // define headers
    const rangeHeader = req.headers.range || null;
    const rangePosition = rangeHeader
      ? rangeHeader.replace(/bytes=/, '').split('-')
      : null;
    const startRange = rangePosition ? parseInt(rangePosition[0], 10) : 0;
    const endRange =
      rangePosition && rangePosition[1].length > 0
        ? parseInt(rangePosition[1], 10)
        : contentLength - 1;
    const chunksize = endRange - startRange + 1;

    //         Send partial response
    res.writeHead(206, {
      'Content-Type': `audio/${container}`,
      'Content-Length': chunksize,
      'Content-Range':
        'bytes ' + startRange + '-' + endRange + '/' + contentLength,
      'Accept-Ranges': 'bytes',
    });

    const range = { start: startRange, end: endRange };
    const audioStream = ytdl(videoId, {
      filter: (format) => format.itag === itag,
      range,
    });
    audioStream.pipe(res);
  } catch (err) {
    return res.status(500).json({ message: 'Audio failed' });
  }
};
