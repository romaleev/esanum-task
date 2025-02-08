import request from 'supertest'
import app from '#server/app'
import fs from 'fs'
import path from 'path'
import { performance } from 'perf_hooks'

const CONCURRENT_UPLOADS = 1000
const POLL_INTERVAL_MS = 500 // Poll every 500ms
const TIMEOUT_SEC = 60 // Fail test if jobs don't finish within 60s

describe('Performance Test - Upload Load', () => {
	it(
		`should complete ${CONCURRENT_UPLOADS} uploads within ${TIMEOUT_SEC} seconds`,
		async () => {
			const filePath = path.resolve('./tests/fixtures/sample_1024_10SEC.mp4')
			const fileBuffer = fs.readFileSync(filePath)

			const startTime = performance.now()

			// Step 1: Upload files and collect job IDs
			const uploadPromises = Array.from({ length: CONCURRENT_UPLOADS }, async (_, index) => {
				const res = await request(`http://localhost:4200`)
					.post('/api/upload')
					.attach('file', fileBuffer, 'sample_1024_10SEC.mp4')
				console.log(`Upload ${index + 1}/${CONCURRENT_UPLOADS} completed`)
				return res.body.jobId
			})

			const jobIds = await Promise.all(uploadPromises)

			// Step 2: Poll status until all jobs are completed
			const checkCompletion = async () => {
				const statuses = await Promise.all(
					jobIds.map(async (jobId) => {
						const res = await request('http://localhost:4200').get(`/api/status/${jobId}`)
						return res.body.status
					}),
				)

				return statuses.every((status) => status === 'completed')
			}

			let completed = false
			const timeout = performance.now() + TIMEOUT_SEC * 1000
			let pollCount = 0

			while (!completed && performance.now() < timeout) {
				completed = await checkCompletion()
				pollCount++
				console.log(
					`Polling attempt ${pollCount}: ${completed ? 'All jobs completed' : 'Jobs still in progress'}`,
				)
				if (!completed) await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS))
			}

			const endTime = performance.now()
			const duration = (endTime - startTime) / 1000 // Convert ms to seconds

			// ✅ Performance logs
			console.log(`🚀 Completed ${CONCURRENT_UPLOADS} jobs in ${duration.toFixed(2)} seconds`)

			// ✅ Assertions
			expect(completed).toBe(true) // Ensure all jobs completed
			expect(duration).toBeLessThan(TIMEOUT_SEC) // Ensure test runs within timeout
		},
		TIMEOUT_SEC * 1000 + 5000,
	) // Extend Jest timeout
})
