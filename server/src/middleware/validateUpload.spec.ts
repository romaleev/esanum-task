import request from 'supertest'
import app from '#server/app'
import path from 'path'
import fs from 'fs'

it('should return 400 for unsupported file format', async () => {
	const res = await request(app)
		.post('/api/upload')
		.attach('file', Buffer.from('dummy-data'), 'invalid.txt')

	expect(res.status).toBe(400)
	expect(res.body).toEqual({ error: 'Invalid file format. Only MP4 is allowed.' })
})

it('should return 400 for video exceeding resolution limit', async () => {
	const filePath = path.resolve('./tests/fixtures/sample_1280_10SEC.mp4') // Mock a large resolution file
	const res = await request(app)
		.post('/api/upload')
		.attach('file', fs.readFileSync(filePath), 'sample_1280_10SEC.mp4')

	expect(res.status).toBe(400)
	expect(res.body).toEqual({ error: 'Resolution exceeds 1024x768 limit' })
})

it('should return 400 for video exceeding duration limit', async () => {
	const filePath = path.resolve('./tests/fixtures/sample_1024_15SEC.mp4') // Mock a long video
	const res = await request(app)
		.post('/api/upload')
		.attach('file', fs.readFileSync(filePath), 'sample_1024_15SEC.mp4')

	expect(res.status).toBe(400)
	expect(res.body).toEqual({ error: 'Video duration exceeds 10 seconds limit' })
})
