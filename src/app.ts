import express from "express";
import {TrackApiModel} from "./models/ApiModel";
import cors from "cors";
import {routerTrack} from "./routes/tracks";
import {db, trackType} from "./db/db";
import {getTestsRouter} from "./routes/tests";

export const app = express();
export const jsonBodyMiddleware = express.json();

export const getTrackViewModel = (dbTrack: trackType): TrackApiModel => {
    return {
        id: dbTrack.id,
        track: dbTrack.track
    }
}

app.use(cors());

app.use(jsonBodyMiddleware);

app.use("/mirage/track", routerTrack);

const testsRouter = getTestsRouter(db);
app.use("/__tests__", testsRouter);