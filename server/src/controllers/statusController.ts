import { Request, Response } from 'express'
import { queue } from '#server/services/queueService'
import { GifJob, JobStatusResponse } from '#server/types/jobTypes'

export const getJobStatus = async (
	req: Request,
	res: Response<JobStatusResponse>,
): Promise<void> => {
	try {
		const job: GifJob | null = await queue.getJob(req.params.jobId)

		if (!job) {
			res.status(404).json({ error: 'Job not found' })
			return
		}

		const state: JobStatusResponse['status'] = await job.getState()

		res.json({
			status: state,
			gifUrl: state === 'completed' ? `/uploads/${job.returnvalue as string}` : null,
		})
	} catch (error) {
		res.status(500).json({ error: `Internal Server Error: ${error}` })
	}
}
