export type trackType = {
    id: number;
    track: string;
    countDownload: number
};
export type dbType = {
    tracks: trackType[];
};
export const db: dbType = {
    tracks: [
        {
            id: 1,
            track: "dream",
            countDownload: 20
        },
        {
            id: 2,
            track: "abroad",
            countDownload: 15
        },
        {
            id: 3,
            track: "good game",
            countDownload: 12
        },
    ],
};