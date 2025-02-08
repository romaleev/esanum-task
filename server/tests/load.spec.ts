import request from 'supertest'
import fs from 'fs'
import path from 'path'
import { performance } from 'perf_hooks'
import cliProgress from 'cli-progress'
import { EventSource } from 'eventsource'

const UPLOAD_BATCH_SIZE = 100
const INTERVAL_MS = 6000
const TOTAL_DURATION_MS = 60000
const POLL_INTERVAL_MS = 500
const API_URL = 'http://localhost:4200'
const filePath = path.resolve('./tests/fixtures/sample_1024_10SEC.mp4')
const fileBuffer = fs.readFileSync(filePath)

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

console.log(
	`🚀 Starting Load Test: ${UPLOAD_BATCH_SIZE} uploads per ${INTERVAL_MS / 1000}s for ${TOTAL_DURATION_MS / 1000}s`,
)

// 🟢 MultiBar for progress bars
const multiBar = new cliProgress.MultiBar(
	{
		clearOnComplete: false,
		hideCursor: true,
		noTTYOutput: process.env.CI === 'true',
		format: '{bar} {percentage}% | {value}/{total} {label}',
	},
	cliProgress.Presets.shades_classic,
)

const uploadProgress = multiBar.create((TOTAL_DURATION_MS / INTERVAL_MS) * UPLOAD_BATCH_SIZE, 0, {
	label: '📤 Uploading',
})
const processingProgress = multiBar.create(
	(TOTAL_DURATION_MS / INTERVAL_MS) * UPLOAD_BATCH_SIZE,
	0,
	{
		label: '⏳ Processing',
	},
)

// Interface for SSE response
interface JobStatusResponse {
	status: 'waiting' | 'active' | 'completed' | 'failed' | 'stuck'
	gifUrl?: string | null
	error?: string
}

const runTest = async (): Promise<void> => {
	try {
		const startTime = performance.now()

		console.log('\n🚀 Uploading files in batches...')

		let completedJobs = 0
		let failedJobs = 0
		const jobIds: string[] = []

		for (let i = 0; i < TOTAL_DURATION_MS / INTERVAL_MS; i++) {
			const batchJobIds = await Promise.all(
				Array.from({ length: UPLOAD_BATCH_SIZE }, async () => {
					try {
						const res = await request(API_URL)
							.post('/api/upload')
							.attach('file', fileBuffer, 'sample_1024_10SEC.mp4')
						uploadProgress.increment()
						return res.body.jobId
					} catch (err) {
						console.error(`❌ Upload failed:`, err)
						return null
					}
				}),
			)

			const validBatchJobIds = batchJobIds.filter(Boolean) as string[]
			jobIds.push(...validBatchJobIds)

			// Immediately start processing the batch
			validBatchJobIds.forEach((jobId) => {
				const eventSource = new EventSource(`${API_URL}/api/status/${jobId}`)

				eventSource.onmessage = (event: MessageEvent) => {
					const data: JobStatusResponse = JSON.parse(event.data)

					if (data.status === 'completed') {
						completedJobs++
						processingProgress.increment()
						eventSource.close()
					} else if (data.status === 'failed') {
						failedJobs++
						console.error(`❌ Job ${jobId} failed`)
						processingProgress.increment()
						eventSource.close()
					}
				}

				eventSource.onerror = () => {
					console.error(`🚨 SSE Error for job ${jobId}`)
					failedJobs++
					processingProgress.increment()
					eventSource.close()
				}
			})

			await sleep(INTERVAL_MS)
		}

		// ✅ **Wait until all jobs finish**
		while (completedJobs + failedJobs < jobIds.length) {
			await sleep(POLL_INTERVAL_MS)
		}

		multiBar.stop()

		const endTime = performance.now()
		const duration = ((endTime - startTime) / 1000).toFixed(2)

		console.log(`\n📊 **Test Results:**`)
		console.log(`✅ Completed: ${completedJobs}/${jobIds.length}`)
		console.log(`❌ Failed: ${failedJobs}/${jobIds.length}`)
		console.log(`⏳ Total Time: ${duration} seconds\n`)

		if (completedJobs === jobIds.length) {
			console.log(`🎉 All ${jobIds.length} jobs completed successfully`)
			process.exit(0)
		} else {
			console.error(`🚨 Some jobs failed: ${failedJobs}/${jobIds.length}`)
			process.exit(1)
		}
	} catch (error) {
		console.error('🚨 Test encountered an error:', error)
		process.exit(1)
	} finally {
		multiBar.stop()
	}
}

// Run the test
runTest()
