import { db, trackType } from "../db/db";
import { getTrackViewModel } from "../app";

export const trackRepository = {
  findTracks(track: string | null | undefined) {

      let foundTrackQuery = db.tracks;

      if (track) {
          foundTrackQuery = foundTrackQuery.filter((item) =>
              item.track.includes(track as string)
          );
      }

      return foundTrackQuery.map(getTrackViewModel);
  },

  createTrack (track: string) {
      const createdTrack: trackType = {
          id: +new Date(),
          track: track,
          countDownload: 0
      };

      db.tracks.push(createdTrack);

      return getTrackViewModel(createdTrack);
  },
  getTrackById (id: number) {
      // const foundTrack: trackType | undefined =

      return db.tracks.find(
          (c) => c.id === id
      );
  },
  updateTrack (id: number, track: string) {
      const foundTrack = db.tracks.find((item) => item.id === id);

      if (foundTrack) {
          foundTrack.track = track;
      }

      return foundTrack;
  },
  deleteTrack (id: number) {
      let isDelete = false;

      if (db.tracks.some((item) => item.id === id)) {
          db.tracks = db.tracks.filter((item) => item.id !== id);
          isDelete = true;
      }
      return isDelete;
  }
}