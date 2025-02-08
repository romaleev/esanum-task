import { Request, Response } from 'express'
import { queue } from '#server/services/queueService'
import { GifJob } from '#server/types/jobTypes'
import { v4 as uuidv4 } from 'uuid'

export const produceJob = async (req: Request, res: Response): Promise<void> => {
	try {
		if (!req.file) {
			res.status(400).json({ error: 'No file uploaded' })
			return
		}

		console.log(`📤 [UPLOAD] Received file: ${req.file.originalname}`)
		console.log(`📤 [UPLOAD] File path: ${req.file.path}`)
		console.log(`📤 [UPLOAD] Going to add to the queue`)

		const isQueueReachable = await queue
			.waitUntilReady()
			.then(() => true)
			.catch(() => false)
		if (!isQueueReachable) {
			res.status(500).json({ error: 'Queue service is not reachable' })
			return
		}

		console.log(`📤 [UPLOAD] Queue is reachable`)
		const job: GifJob = await queue.add(
			'gif-processing',
			{ filename: req.file.filename },
			{
				jobId: uuidv4(),
				removeOnComplete: { age: 300, count: 10 }, // Keep job for 5 minutes (300s)
				removeOnFail: { age: 600, count: 5 }, // Keep failed jobs for 10 minutes (600s)
				attempts: 3, // Retry up to 3 times
				backoff: { type: 'fixed', delay: 5000 },
			},
		)

		if (!job) {
			res.status(500).json({ error: 'Failed to add job to the queue' })
			return
		}

		console.log(`📌[UPLOAD] Job added to queue - ID ${job.id}, path: ${req.file.path}`)

		res.json({ jobId: job.id })
	} catch (error) {
		res.status(500).json({ error: `Internal Server Error: ${error}` })
	}
}
