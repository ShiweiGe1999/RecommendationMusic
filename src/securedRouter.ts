import express from 'express';
import {
  getMyPlaylists,
  createMyPlaylist,
  deleteMyPlaylist,
} from './controllers/mediaController';
import {
  getMyPlaylistSongs,
  addMySongs,
  deleteMySongs,
} from './controllers/mediaController';
const securedRouter = express.Router();

securedRouter.get('/playlist', getMyPlaylists);
securedRouter.post('/playlist', createMyPlaylist);
securedRouter.delete('playlist/:id', deleteMyPlaylist);

securedRouter.get('/songs/:playlistId', getMyPlaylistSongs);
securedRouter.post('/songs', addMySongs);
securedRouter.delete('/songs', deleteMySongs);

export default securedRouter;
