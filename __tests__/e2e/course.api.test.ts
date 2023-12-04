import request from "supertest";
import { app } from "../../src";
import { HTTP_STATUSES } from "../../src";

describe('./course', () => {
  beforeAll(async () => {
    await request(app).delete('/__tests__/data')
  })

  it('should return 200 and empty array', async () => {
    await request(app).get('/mirage/track').expect(HTTP_STATUSES.OK_200, [])
  })

  it('should return 404 for not existing track', async () => {
    await request(app).get('/mirage/track/1').expect(HTTP_STATUSES.NOT_FOUND_404)
  })

  it('should return 404 for not existing track', async () => {
    await request(app).post('/mirage/track').send({track: ''}).expect(HTTP_STATUSES.BAD_REQUEST_400)
    
    await request(app).get('/mirage/track').expect(HTTP_STATUSES.OK_200, [])
  })

  let createdTrack: any = null;

  it('should return 201 for create track with correct input data', async () => {
    const nameTrack: string = 'new track of mirage';

    const createResponse = await request(app).post('/mirage/track').send({track: nameTrack}).expect(HTTP_STATUSES.CREATED_201);
    createdTrack = createResponse.body;

    expect(createdTrack).toEqual({
      id: expect.any(Number),
      track: nameTrack
    })

    await request(app).get('/mirage/track').expect(HTTP_STATUSES.OK_200, [createdTrack]);
  })

  it('should\'nt update track with incorrect input data', async () => {
    await request(app).put('/mirage/track/' + createdTrack.id).send({track: ''}).expect(HTTP_STATUSES.BAD_REQUEST_400)

    await request(app).get('/mirage/track/' + createdTrack.id).expect(HTTP_STATUSES.OK_200, createdTrack)
  })

  it('should\'nt update track that not exist', async () => {
    await request(app).put('/mirage/track/' + -100).send({track: 'new track'}).expect(HTTP_STATUSES.BAD_REQUEST_400)
  })
 
  it('should update corse track with correct input data', async () => {
    const newTrackName: string = 'new track 2'

    await request(app).put('/mirage/track/' + createdTrack.id).send({track: newTrackName}).expect(HTTP_STATUSES.NO_CONTENT_204)

    await request(app).get('/mirage/track/' + createdTrack.id).expect(HTTP_STATUSES.OK_200, {
      ...createdTrack,
      track: newTrackName
    })
  })

  // it('should create track with correct input data', async () => {
  //   await request(app).post('/mirage/track').send({title: 'new track'})
  // })
})