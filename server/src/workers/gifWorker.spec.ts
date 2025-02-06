import { queue } from '#server/services/queueService'
import path from 'path'
import fs from 'fs'
import { Job } from 'bull'

describe('Gif Worker', () => {
	it('should convert MP4 to GIF', async () => {
		const inputPath = path.resolve('../tests/sample_1024_10SEC.mp4')
		const job: Job<string> = await queue.add({ filePath: inputPath })

		const result: string = await job.finished()

		expect(fs.existsSync(result)).toBe(true)
	})
})
