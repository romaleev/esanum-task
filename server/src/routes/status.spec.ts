import request from 'supertest'
import app from '#server/app'
import fs from 'fs'
import path from 'path'
import { EventSource } from 'eventsource'

describe('GET /api/status/:jobId (SSE)', () => {
	it('should stream job status updates via SSE', async () => {
		const filePath = path.resolve('../tests/sample_1024_10SEC.mp4')

		// ✅ Upload file and get jobId
		const uploadRes = await request(app)
			.post('/api/upload')
			.attach('file', fs.readFileSync(filePath), 'sample_1024_10SEC.mp4')

		expect(uploadRes.status).toBe(200)
		expect(uploadRes.body.jobId).toBeDefined()

		const jobId = uploadRes.body.jobId

		// ✅ Open SSE connection to listen for status updates
		const eventSource = new EventSource(`http://localhost:3000/api/status/${jobId}`)

		let jobCompleted = false
		let jobFailed = false
		let gifUrl: string | null = null

		await new Promise<void>((resolve, reject) => {
			const timeout = setTimeout(() => {
				eventSource.close()
				reject(new Error('Timeout: Job did not complete in time'))
			}, 5000) // 20 seconds timeout

			eventSource.onmessage = (event) => {
				const data = JSON.parse(event.data)

				if (data.status === 'completed') {
					jobCompleted = true
					gifUrl = data.gifUrl
					eventSource.close()
					clearTimeout(timeout)
					resolve()
				} else if (data.status === 'failed') {
					jobFailed = true
					eventSource.close()
					clearTimeout(timeout)
					resolve()
				}
			}

			eventSource.onerror = (error) => {
				eventSource.close()
				clearTimeout(timeout)
				reject(new Error(`SSE Error: ${JSON.stringify(error)}`))
			}
		})

		// ✅ Ensure job is either completed or failed
		expect(jobCompleted || jobFailed).toBe(true)

		if (jobCompleted) {
			expect(gifUrl).toBeDefined()
			expect(gifUrl).toMatch(/\.gif$/) // ✅ Ensure it's a GIF file
		}
	})
})
