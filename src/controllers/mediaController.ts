import { collections } from '../server';
import {
  getPlaylists,
  deletePlaylist,
  createPlaylist,
} from '../dbOps/playlistDbOps';
import { getPlaylistSongs, addSongs, deleteSongs } from '../dbOps/songsDbOps';
import { Response, Request, NextFunction } from 'express';

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
