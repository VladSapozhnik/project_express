import cors from "cors";
import express, { Request, Response } from "express";
import {
  RequestWithQuery,
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
} from "./types";
import { TrackCreateModel } from "./models/CreateModel";
import { TrackGetModel } from "./models/QueryModel";
import { TrackUpdateModel } from "./models/UpdateModel";
import { TrackApiModel } from "./models/ApiModel";
import { URIParamsTrackModel } from "./models/URIParamsModel";


export const app = express();

const PORT = process.env.PORT || 3500;

app.use(cors());

const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware);

export const HTTP_STATUSES = {
  OK_200: 200,
  CREATED_201: 201,
  NO_CONTENT_204: 204,

  BAD_REQUEST_400: 400,
  NOT_FOUND_404: 404,
};

type trackType = {
  id: number;
  track: string;
};

type dbType = {
  track: trackType[];
};

const db: dbType = {
  track: [
    {
      id: 1,
      track: "dream",
    },
    {
      id: 2,
      track: "abroad",
    },
    {
      id: 3,
      track: "good game",
    },
  ],
};

app.get("/", (req: Request, res: Response) => {
  res.send(
    'Hello world <a href="/mirage">To Mirage</a><br><a href="/friends">To Friends</a>'
  );
});

app.get(
  "/mirage/track",
  (req: RequestWithQuery<TrackGetModel>, res: Response<TrackApiModel[]>) => {
    const query = req.query;

    let foundTrackQuery = db.track;

    if (query.track) {
      foundTrackQuery = foundTrackQuery.filter((item) =>
        item.track.includes(query.track as string)
      );
    }

    res.json(foundTrackQuery.map(dbTrack => {
      return {
        id: dbTrack.id,
        track: dbTrack.track
      }
    }));
  }
);

app.get(
  "/mirage/track/:id",
  (req: RequestWithParams<URIParamsTrackModel>, res: Response<TrackApiModel>) => {
    // console.log(req)
    const foundTrack: trackType | undefined = db.track.find(
      (c) => c.id === +req.params.id
    );

    if (!foundTrack) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
      return;
    }

    res.json({
      id: foundTrack.id,
      track: foundTrack.track
    });
  }
);

app.post(
  "/mirage/track",
  (req: RequestWithBody<TrackCreateModel>, res: Response<TrackApiModel>) => {
    if (!req.body.track && !req.body.track.length) {
      res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
      return;
    }

    const createdTrack: trackType = {
      id: +new Date(),
      track: req.body.track,
    };

    db.track.push(createdTrack);

    res.status(HTTP_STATUSES.CREATED_201).json({
      id: createdTrack.id,
      track: createdTrack.track
    });
  }
);

app.delete(
  "/mirage/track/:id",
  (req: RequestWithParams<URIParamsTrackModel>, res: Response) => {
    const paramId: number = +req.params.id;

    if (db.track.some((item) => item.id === paramId)) {
      db.track = db.track.filter((item) => item.id !== paramId);
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  }
);

app.put(
  "/mirage/track/:id",
  (
    req: RequestWithParamsAndBody<URIParamsTrackModel, TrackUpdateModel>,
    res: Response
  ) => {
    if (!req.body.track) {
      res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
      return;
    }

    const foundTrack = db.track.find((item) => item.id === +req.params.id);

    if (!foundTrack) {
      res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
      return;
    }

    foundTrack.track = req.body.track;
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  }
);

//db null in this test
app.delete("/__tests__/data", (req: Request, res: Response) => {
  db.track = [];
  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
