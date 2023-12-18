//db null in this test
import {dbType} from "../db/db";
import express, {Request, Response} from "express";
import {HTTP_STATUSES} from "../utils";


export const getTestsRouter = (db: dbType) => {
    const router = express.Router();

    router.delete("/data", (req: Request, res: Response) => {
        db.tracks = [];
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    });

    return router;
}
