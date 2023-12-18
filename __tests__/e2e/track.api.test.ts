import request from 'supertest';
import { TrackCreateModel } from '../../src/models/CreateModel';
import { TrackUpdateModel } from '../../src/models/UpdateModel';
import {app} from "../../src/app";
import {HTTP_STATUSES} from "../../src/utils";

describe('/track', () => {
  beforeAll(async () => {
    await request(app).delete('/__tests__/data')
  })

  it ('should return 200 and empty array', async () => {
    await request(app).get('/mirage/track').expect(HTTP_STATUSES.OK_200, [])
  })

  it ('should return 404 for not existing track', async () => {
    await request(app).get('/mirage/track/1').expect(HTTP_STATUSES.NOT_FOUND_404)
  })

  it ('should\'nt create track with incorrect input data', async () => {
    const data: TrackCreateModel = {track: ''}

    await request(app).post('/mirage/track').send(data).expect(HTTP_STATUSES.BAD_REQUEST_400)

    await request(app).get('/mirage/track').expect(HTTP_STATUSES.OK_200, [])
  })

  let createdTrack1: any = null;
  it ('should create track with correct input data', async () => {
    const nameTrack = 'new track';

    const data: TrackCreateModel = {track: nameTrack}

    const createResponse = await request(app).post('/mirage/track').send(data).expect(HTTP_STATUSES.CREATED_201)

    createdTrack1 = createResponse.body;

    expect(createdTrack1).toEqual({
      id: expect.any(Number),
      track: nameTrack
    })

    await request(app).get('/mirage/track').expect(HTTP_STATUSES.OK_200, [createdTrack1])
  })

  let createdTrack2: any = null;
  it ('should create track 2 with correct input data', async () => {
    const nameTrack = 'new track 2';

    const data: TrackCreateModel = {track: nameTrack};

    const createResponse = await request(app).post('/mirage/track').send(data).expect(HTTP_STATUSES.CREATED_201)

    createdTrack2 = createResponse.body;

    expect(createdTrack2).toEqual({
      id: expect.any(Number),
      track: nameTrack
    })

    await request(app).get('/mirage/track').expect(HTTP_STATUSES.OK_200, [createdTrack1, createdTrack2])
  })

  it ('should\'nt update track with incorrect input data', async () => {
    const data: TrackCreateModel = {track: ''}

    await request(app).put('/mirage/track/' + createdTrack1.id).send(data).expect(HTTP_STATUSES.BAD_REQUEST_400)

    await request(app).get('/mirage/track/' + createdTrack1.id).expect(HTTP_STATUSES.OK_200, createdTrack1)
  })

  it ('should update track that not exist', async () => {
    const newNameTrack: string = 'new track'

    const data: TrackUpdateModel = {track: newNameTrack};

    await request(app).put('/mirage/track/' + -100).send(data).expect(HTTP_STATUSES.NOT_FOUND_404)
  })

  it ('should update track with correct input data', async () => {
    const newNameTrack = 'new name track';

    const data: TrackUpdateModel = {track: newNameTrack};

    await request(app).put('/mirage/track/' + createdTrack1.id).send(data).expect(HTTP_STATUSES.NO_CONTENT_204)

    await request(app).get('/mirage/track/' + createdTrack1.id).expect(HTTP_STATUSES.OK_200, {
      ...createdTrack1,
      track: newNameTrack
    })

    await request(app).get('/mirage/track/' + createdTrack2.id).expect(HTTP_STATUSES.OK_200, createdTrack2)
  })

  it('should\'nt delete track', async () => {
    await request(app).delete('/mirage/track/' + -100).expect(HTTP_STATUSES.BAD_REQUEST_400)
  })

  it ('should delete both track', async () => {
    await request(app).delete('/mirage/track/' + createdTrack1.id).expect(HTTP_STATUSES.NO_CONTENT_204)

    await request(app).get('/mirage/track/' + createdTrack1).expect(HTTP_STATUSES.NOT_FOUND_404)

    await request(app).delete('/mirage/track/' + createdTrack2.id).expect(HTTP_STATUSES.NO_CONTENT_204)

    await request(app).get('/mirage/track/' + createdTrack2).expect(HTTP_STATUSES.NOT_FOUND_404)

    await request(app).get('/mirage/track/').expect(HTTP_STATUSES.OK_200, [])
  })
})