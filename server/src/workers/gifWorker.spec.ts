import { queue } from '#server/services/queueService'
import path from 'path'
import { promises as fs } from 'fs'
import { Job } from 'bull'
import { exists } from '#server/common/util'

describe('Gif Worker', () => {
	it('should convert MP4 to GIF', async () => {
		const filename = 'sample_1024_10SEC.mp4'
		const gifName = 'workerTest'
		const inputPath = path.join(`./tests/fixtures/${filename}`)
		const outputPath = path.join(`./uploads/${filename}`)
		const gifPath = path.join(`./uploads/${gifName}.gif`)

		try {
			await fs.copyFile(inputPath, outputPath)
			if (await exists(gifPath)) await fs.rm(gifPath)
		} catch (err) {
			console.log('Error: ', err)
		}

		const job: Job<string> = await queue.add({ filename }, { jobId: gifName })

		await job.finished()

		const expectedPath = path.join('./uploads', `${job.id}.gif`)
		expect(await exists(expectedPath)).toBe(true)
	})
})
