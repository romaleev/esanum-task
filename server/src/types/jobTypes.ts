import { Job, JobStatus } from 'bull'

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
	status?: JobStatus | 'stuck'
	gifUrl?: string | null
	error?: string
}

/**
 * Bull job type with strict typing for job data.
 */
export type GifJob = Job<GifJobData>
