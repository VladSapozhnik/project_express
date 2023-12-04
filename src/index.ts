import cors from "cors";
import express, { Request, Response } from "express";
import {
  RequestWithQuery,
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
} from "./types";
import { FriendsCreateModel, TrackCreateModel } from "./models/CreateModel";
import { TrackGetModel } from "./models/QueryModel";
import { FriendsUpdateModel, TrackUpdateModel } from "./models/UpdateModel";


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

type friendType = {
  id: number;
  name: string;
};

type dbType = {
  friends: friendType[];
  track: trackType[];
};

const db: dbType = {
  friends: [
    {
      id: 1,
      name: "Kirill",
    },
    {
      id: 2,
      name: "Alex",
    },
    {
      id: 3,
      name: "Lena",
    },
  ],
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

app.get("/mirage", (req: Request, res: Response) => {
  res.send("MIRAGE VS");
});

app.get(
  "/mirage/track",
  (req: RequestWithQuery<TrackGetModel>, res: Response<trackType[]>) => {
    const query = req.query;

    let foundTrackQuery = db.track;

    if (query.track) {
      foundTrackQuery = foundTrackQuery.filter((item) =>
        item.track.includes(query.track as string)
      );
    }

    res.json(foundTrackQuery);
  }
);

app.post(
  "/mirage/track",
  (req: RequestWithBody<TrackCreateModel>, res: Response<trackType>) => {
    if (!req.body.track && !req.body.track.length) {
      res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
      return;
    }

    const createdTrack = {
      id: +new Date(),
      track: req.body.track,
    };

    db.track.push(createdTrack);

    res.status(HTTP_STATUSES.CREATED_201).json(createdTrack);
  }
);

app.get(
  "/mirage/track/:id",
  (req: RequestWithParams<{ id: string }>, res: Response) => {
    // console.log(req)
    const foundTrack: trackType | undefined = db.track.find(
      (c) => c.id === +req.params.id
    );

    if (!foundTrack) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
      return;
    }

    res.json(foundTrack);
  }
);

app.delete(
  "/mirage/track/:id",
  (req: RequestWithParams<{ id: string }>, res: Response) => {
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
    req: RequestWithParamsAndBody<{ id: string }, TrackUpdateModel>,
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

app.post("/author", (req: Request, res: Response) => {
  res.send("author this text Mirage");
});

// friends
app.get("/friends", (req: Request, res: Response) => {
  res.send("Hello my friends");
});

app.get(
  "/friends/:id",
  (req: RequestWithParams<{ id: string }>, res: Response) => {
    const findFriend = db.friends.find((item) => item.id === +req.params.id);

    if (!findFriend) {
      res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
      return;
    }

    res.json(findFriend);
  }
);

app.post(
  "/friends",
  (req: RequestWithBody<FriendsCreateModel>, res: Response<friendType>) => {
    if (!req.body.name) {
      res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
      return;
    }

    const createdFriend = {
      id: +new Date(),
      name: req.body.name,
    };

    db.friends.push(createdFriend);

    res.status(HTTP_STATUSES.CREATED_201).json(createdFriend);
  }
);

app.put(
  "/friends/:id",
  (
    req: RequestWithParamsAndBody<{ id: string }, FriendsUpdateModel>,
    res: Response
  ) => {
    const findFriend: friendType | undefined = db.friends.find(
      (friend) => friend.id === +req.params.id
    );

    if (!req.body.name || !findFriend) {
      res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
      return;
    }

    findFriend.name = req.body.name;

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  }
);

app.delete(
  "/friends/:id",
  (req: RequestWithParams<{ id: string }>, res: Response) => {
    if (!req.params.id) {
      res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
      return;
    }

    db.friends = db.friends.filter((item) => item.id !== +req.params.id);

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
