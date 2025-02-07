import request from 'supertest'
import fs from 'fs'
import path from 'path'
import app from '#server/app'

describe('POST /api/upload', () => {
	it('should accept an MP4 file and return a jobId', async () => {
		const filePath = path.resolve('./tests/fixtures/sample_1024_10SEC.mp4')
		const res = await request(app)
			.post('/api/upload')
			.attach('file', fs.readFileSync(filePath), 'sample_1024_10SEC.mp4')

		expect(res.status).toBe(200)
		expect(typeof parseInt(res.body.jobId)).toBe('number')
	})
})

describe('POST /api/upload - File Size Validation', () => {
	it('should return 400 for file exceeding size limit', async () => {
		// Create a 11MB dummy file buffer
		const largeFileBuffer = Buffer.alloc(11 * 1024 * 1024, 'a')

		const res = await request(app).post('/api/upload').attach('file', largeFileBuffer, 'large.mp4') // 11MB file

		expect(res.status).toBe(400)
		expect(res.body).toEqual({ error: 'File too large' })
	})
})

// curl -X POST -F "file=@tests/sample_1024_10SEC.mp4;type=video/mp4" http://localhost:3000/api/upload
// curl -X GET http://localhost:3000/api/status/1
