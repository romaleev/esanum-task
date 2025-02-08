import { Request, Response } from 'express'
import { queue, queueEvents } from '#server/services/queueService'
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

	// Send initial status
	const sendStatus = async (status: string, gifUrl?: string | null) => {
		const responseData = JSON.stringify({ status, gifUrl })
		res.write(`data: ${responseData}\n\n`)
	}

	// Get current status and send
	const initialState = await job.getState()
	await sendStatus(initialState, initialState === 'completed' ? `/api/gif/${job.id}.gif` : null)

	// Subscribe to job events instead of polling
	const onJobComplete = async (job: { jobId: string; returnvalue?: string }) => {
		if (job.jobId === jobId) {
			await sendStatus('completed', `/api/gif/${job.jobId}.gif`)
			res.end()
		}
	}

	const onJobFailed = async (job: { jobId: string }) => {
		if (job.jobId === jobId) {
			await sendStatus('failed', null)
			res.end()
		}
	}

	// Listen for job events
	queueEvents.on('completed', onJobComplete)
	queueEvents.on('failed', onJobFailed)

	// Cleanup listeners when client disconnects
	req.on('close', () => {
		queueEvents.off('completed', onJobComplete)
		queueEvents.off('failed', onJobFailed)
	})
}
