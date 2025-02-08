import { Queue, QueueEvents } from 'bullmq'
import { config } from '#server/common/env'

console.log(`Connecting to Redis at ${config.redisHost}:${config.redisPort}`)

export const queue = new Queue('gifQueue', {
	connection: { host: config.redisHost, port: Number(config.redisPort) },
})

export const queueEvents = new QueueEvents('gifQueue', {
	connection: { host: config.redisHost, port: Number(config.redisPort) },
})
