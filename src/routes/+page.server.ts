import { db } from '$lib/server/db';
import { song, type Song } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  try {
    const loadedSongs = await db.select().from(song);
    return {
      songs: loadedSongs.map(song => ({
        ...song,
        bytes: Buffer.from(song.bytes as Buffer).toString('base64')
      }))
    };
  } catch (error) {
    console.error('Failed to load songs:', error);
    return { songs: [] };
  }
};

export const actions = {
  createSong: async ({ request }) => {
    try {
      const data = await request.json();
      const songToCreate = {
        ...data,
        bytes: Buffer.from(data.bytes)
      };
      
      await db.insert(song).values(songToCreate);
      return { success: true };
    } catch (error) {
      console.error('Failed to create song:', error);
      return { success: false };
    }
  }
};