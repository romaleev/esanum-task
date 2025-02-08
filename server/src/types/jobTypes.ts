import { Job, JobState } from 'bullmq'

/**
 * Defines the structure of job data for GIF conversion.
 */
export interface GifJobData {
	filename: string
}

/**
 * Defines the response structure for the /status/:jobId API.
 */
export interface JobStatusResponse {
	status?: JobState
	gifUrl?: string | null
	error?: string
}

export interface JobEventPayload {
	jobId: string
	returnvalue?: string
	prev?: string
}

export interface JobFailedEventPayload {
	jobId: string
	failedReason: string
}

/**
 * Bull job type with strict typing for job data.
 */
export type GifJob = Job<GifJobData>
