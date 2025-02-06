import Bull from 'bull'
import { config } from '#server/config/env'

export const queue = new Bull('gifQueue', {
	redis: { host: config.redisHost, port: Number(config.redisPort) },
})
