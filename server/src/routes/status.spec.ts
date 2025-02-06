import request from 'supertest'
import app from '#server/app'
import fs from 'fs'
import path from 'path'

describe('GET /api/status/:jobId', () => {
	it('should return job status', async () => {
		const filePath = path.resolve('../tests/sample_1024_10SEC.mp4')
		const jobId = (
			await request(app)
				.post('/api/upload')
				.attach('file', fs.readFileSync(filePath), 'sample_1024_10SEC.mp4')
		).body.jobId

		const res200 = await request(app).get(`/api/status/${jobId}`)

		expect(res200.status).toBe(200)
		expect(res200.body.status).toBe('waiting')

		const res404 = await request(app).get(`/api/status/${jobId}1`)
		expect(res404.status).toBe(404)
	})
})
