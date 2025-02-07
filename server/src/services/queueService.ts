import Bull from 'bull'
import { config } from '#server/config/env'

export const queue = new Bull('gifQueue', {
	redis: { host: config.redisHost, port: Number(config.redisPort) },
	settings: {
		maxStalledCount: 1, // Prevent jobs from getting stuck
	},
	limiter: {
		max: 1000, // Allow 1000 jobs per minute
		duration: 60000, // 1 minute window
	},
})
