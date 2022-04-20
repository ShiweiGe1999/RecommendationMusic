import ytsr, { Result, Options, Item } from 'ytsr';
import ytdl from 'ytdl-core';
import fs from 'fs';
async function search(name: string): Promise<Item[]> {
  // const results = await ytsr(name, { limit: 1 });
  // console.log(results);
  const filters1 = await ytsr.getFilters(name);
  const filter1 = filters1.get('Type').get('Video');
  const options: Options = {
    limit: 5,
  };
  const results = await ytsr(filter1.url, options);
  const { items } = results;
  console.log(items);
  return items;
}

ytdl('kXYiU_JCYtU').pipe(fs.createWriteStream('Link.mp4'));
