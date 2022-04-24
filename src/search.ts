import ytsr, { Result, Options, Item } from 'ytsr';
import ytdl from 'ytdl-core';
import fs from 'fs';
import request from 'request-promise';

export async function search(name: string) {
  // const results = await ytsr(name, { limit: 1 });
  // console.log(results);
  const filters1 = await ytsr.getFilters(name);
  const filter1 = filters1.get('Type').get('Video');
  const options: Options = {
    limit: 5,
  };
  const results = await ytsr(filter1.url, options);
  const { items }: { items: any[] } = results;
  if (!items || items.length <= 0) return null;
  const finalResult = {
    title: items[0].title,
    videoId: items[0].id,
    thumbnail: items[0]?.bestThumbnail?.url,
    duration: items[0]?.duration,
  };
  return finalResult;
}

export async function getTestSongs(songs: string[]) {
  const result = [];
  for (let e of songs) {
    result.push(await search(e));
  }
  return result;
}

export async function getRecommendedSongs(song: string) {
  const songs = await request.post('http://127.0.0.1:5001/recommend', {
    form: {
      song,
    },
  });
  const parsedSongs = JSON.parse(songs);
  for (let i = 0; i < parsedSongs.length; i++) {
    parsedSongs[i] = await search(parsedSongs[i]);
  }
  return parsedSongs;
}

// ytdl('HmP_wGYw1_g').pipe(fs.createWriteStream('Link.mp4'));
