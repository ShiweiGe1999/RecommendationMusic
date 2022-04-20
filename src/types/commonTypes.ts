import { ObjectId } from 'mongodb';
import { Collection } from 'mongodb';
export interface UserInfo {
  email: string;
  password: string;
  [keys: string]: any;
}

export interface Playlist {
  name: string;
  [keys: string]: any;
}

export interface Song {
  title: string;
  url?: string;
  thumbnail: string;
  videoId: string;
}

export interface Collections {
  users?: Collection;
  playlist?: Collection;
  recommended_songs?: Collection;
  songs?: Collection;
}
