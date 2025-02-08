import { Request, Response } from 'express'
import { queue } from '#server/services/queueService'
import { GifJob, JobStatusResponse } from '#server/types/jobTypes'

export const streamJobStatus = async (req: Request, res: Response<JobStatusResponse>) => {
	const jobId = req.params.jobId
	const job: GifJob | null = await queue.getJob(jobId)

	if (!job) {
		res.status(404).json({ error: 'Job not found' })
		return
	}

	// Set headers for SSE
	res.setHeader('Content-Type', 'text/event-stream')
	res.setHeader('Cache-Control', 'no-cache')
	res.setHeader('Connection', 'keep-alive')

	// Function to send job status updates
	const sendStatus = async () => {
		const state = await job.getState()
		const responseData = JSON.stringify({
			status: state,
			gifUrl: state === 'completed' ? `/api/gif/${job.id}.gif` : null,
		})
		res.write(`data: ${responseData}\n\n`)
	}

	// Send initial status
	await sendStatus()

	// Check job status every second
	const interval = setInterval(async () => {
		await sendStatus()

		// Stop sending events once job is completed or failed
		const state = await job.getState()
		if (state === 'completed' || state === 'failed') {
			clearInterval(interval)
			res.end()
		}
	}, 1000)

	// Handle client disconnect
	req.on('close', () => {
		clearInterval(interval)
	})
}
