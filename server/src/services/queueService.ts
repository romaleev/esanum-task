import Bull from 'bull'
import { config } from '#server/common/env'

console.log(`Connecting to Redis at ${config.redisHost}:${config.redisPort}`)

export const queue = new Bull('gifQueue', {
	redis: { host: config.redisHost, port: Number(config.redisPort) },
	limiter: {
		max: 1000, // Allow 1000 jobs per minute
		duration: 60000, // 1 minute window
	},
})
