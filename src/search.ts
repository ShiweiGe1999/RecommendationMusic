import ytsr, { Result, Options, Item } from 'ytsr';
import ytdl from 'ytdl-core';
import fs from 'fs';

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
    id: items[0].id,
    thumbnail: items[0]?.bestThumbnail?.url,
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

// ytdl('HmP_wGYw1_g').pipe(fs.createWriteStream('Link.mp4'));
