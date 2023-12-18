import express, { Response } from "express";
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  RequestWithQuery,
} from "../types";
import { TrackGetModel } from "../models/QueryModel";
import { TrackApiModel } from "../models/ApiModel";
import { URIParamsTrackModel } from "../models/URIParamsModel";
import { TrackCreateModel } from "../models/CreateModel";
import { TrackUpdateModel } from "../models/UpdateModel";
import { getTrackViewModel } from "../app";
import { dbType, trackType } from "../db/db";
import { HTTP_STATUSES } from "../utils";
import { trackRepository } from "../repository/TrackRepository";

export const routerTrack = express.Router();

routerTrack.get(
  "/",
  (req: RequestWithQuery<TrackGetModel>, res: Response<TrackApiModel[]>) => {
    const foundTrack: TrackApiModel[] = trackRepository.findTracks(
      req.query.track
    );

    res.json(foundTrack);

    // const query = req.query;
    //
    // let foundTrackQuery = db.tracks;
    //
    // if (query.track) {
    //     foundTrackQuery = foundTrackQuery.filter((item) =>
    //         item.track.includes(query.track as string)
    //     );
    // }
    //
    // res.json(foundTrackQuery.map(getTrackViewModel));
  }
);

routerTrack.get(
  "/:id",
  (
    req: RequestWithParams<URIParamsTrackModel>,
    res: Response<TrackApiModel>
  ) => {
    const foundTrack: trackType | undefined = trackRepository.getTrackById(
      +req.params.id
    );

    // const foundTrack: trackType | undefined = db.tracks.find(
    //     (c) => c.id === +req.params.id
    // );

    if (!foundTrack) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
      return;
    }

    res.json(getTrackViewModel(foundTrack));
  }
);

routerTrack.post(
  "/",
  (req: RequestWithBody<TrackCreateModel>, res: Response<TrackApiModel>) => {
    if (!req.body.track && !req.body.track.length) {
      res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
      return;
    }

    const createTrack: TrackApiModel = trackRepository.createTrack(
      req.body.track
    );

    res.status(HTTP_STATUSES.CREATED_201).json(createTrack);

    // const createdTrack: trackType = {
    //     id: +new Date(),
    //     track: req.body.track,
    //     countDownload: 0
    // };
    //
    // db.tracks.push(createdTrack);
    //
    // res.status(HTTP_STATUSES.CREATED_201).json(getTrackViewModel(createdTrack));
  }
);

routerTrack.delete(
  "/:id",
  (req: RequestWithParams<URIParamsTrackModel>, res: Response) => {
    // const paramId: number = +req.params.id;

    const isDelete = trackRepository.deleteTrack(+req.params.id);

    if (!isDelete) {
      res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
    }
    // if (db.tracks.some((item) => item.id === paramId)) {
    //     db.tracks = db.tracks.filter((item) => item.id !== paramId);
    // }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  }
);

routerTrack.put(
  "/:id",
  (
    req: RequestWithParamsAndBody<URIParamsTrackModel, TrackUpdateModel>,
    res: Response
  ) => {
    if (!req.body.track) {
      res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
      return;
    }

    // const foundTrack = db.tracks.find((item) => item.id === +req.params.id);
    const foundTrack = trackRepository.updateTrack(
      +req.params.id,
      req.body.track
    );

    if (!foundTrack) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
      return;
    }

    // foundTrack.track = req.body.track;
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  }
);
