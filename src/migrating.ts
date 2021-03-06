import { getTestSongs } from './search';
import { Collections } from './types/commonTypes';
import { createUser } from './dbOps/usersDbOps';
import { createPlaylist } from './dbOps/playlistDbOps';
import { addSongs } from './dbOps/songsDbOps';
import Mongo from './db';
const testSongs = ['City of God', 'Hurricane', 'first class'];
export const collections: any = {};
const migrating = async (collections: any) => {
  /**
   * Add test user
   * email: Ge@gmail.com
   * Strong password:  Aa123456789
   */
  const result = await createUser(collections.users, {
    email: 'Ge@gmail.com',
    password: 'Aa123456789',
  });
  /**
   * create test user's playlist
   * name: likes
   */
  const result2 = await createPlaylist(
    collections.playlist,
    { name: 'likes' },
    result.insertedId,
    true
  );
  /**
   * add test songs
   */
  const songs = await getTestSongs(testSongs);
  const result3 = await addSongs(collections.songs, songs, result2.insertedId);
  return;
};
const boot = async () => {
  await Mongo.main();
  // contruct our collections
  collections.users = Mongo.db.collection('users');
  collections.playlist = Mongo.db.collection('playlist');
  collections.recommended_songs = Mongo.db.collection('recommended_songs');
  collections.songs = Mongo.db.collection('songs');
  // clean up
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
  await migrating(collections);
  return;
};

boot().then(() => console.log('migrating finished'));
