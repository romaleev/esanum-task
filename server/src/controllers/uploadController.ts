import { Request, Response } from 'express'
import { queue } from '#server/services/queueService'
import { GifJob } from '#server/types/jobTypes'

export const uploadFile = async (req: Request, res: Response): Promise<void> => {
	try {
		if (!req.file) {
			res.status(400).json({ error: 'No file uploaded' })
			return
		}

		const job: GifJob | null = await queue.add(
			{ filePath: req.file.path },
			{
				removeOnComplete: { age: 300, count: 10 }, // Keep job for 5 minutes (300s)
				removeOnFail: { age: 600, count: 5 }, // Keep failed jobs for 10 minutes (600s)
			},
		)

		console.log(`📌 [UPLOAD] Job added to queue - ID ${job.id}, path: ${req.file.path}`)

		res.json({ jobId: job.id })
	} catch (error) {
		res.status(500).json({ error: `Internal Server Error: ${error}` })
	}
}
