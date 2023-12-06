import request from 'supertest';
import { HTTP_STATUSES, app } from '../../src';

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
    await request(app).post('/mirage/track').send({track: ''}).expect(HTTP_STATUSES.BAD_REQUEST_400)

    await request(app).get('/mirage/track').expect(HTTP_STATUSES.OK_200, [])
  })

  it ('should create track with correct input data', async () => {
    const nameTrack = 'new track';

    const createResponse = await request(app).post('/mirage/track').send({track: nameTrack}).expect(HTTP_STATUSES.CREATED_201)

    const createdTrack = createResponse.body;

    expect(createdTrack).toEqual({
      id: expect.any(Number),
      track: nameTrack
    })

    await request(app).get('/mirage/track').expect([createdTrack])
  })
})