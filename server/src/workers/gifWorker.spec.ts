import { queue } from '#server/services/queueService'
import path from 'path'
import fs from 'fs'
import { Job } from 'bull'

describe('Gif Worker', () => {
	it('should convert MP4 to GIF', async () => {
		const inputPath = path.resolve('./tests/fixtures/sample_1024_10SEC.mp4')
		const job: Job<string> = await queue.add({ filePath: inputPath })

		await job.finished()

		const expectedPath = path.join('app/uploads', `${job.id}.gif`)
		expect(fs.existsSync(expectedPath)).toBe(true)
	})
})
