import { Queue, QueueEvents } from 'bullmq'
import { redisHost, redisPort } from '#server/common/env'

console.log(`Connecting to Redis at ${redisHost}:${redisPort}`)

export const queue = new Queue('gifQueue', {
	connection: { host: redisHost, port: Number(redisPort) },
})

export const queueEvents = new QueueEvents('gifQueue', {
	connection: { host: redisHost, port: Number(redisPort) },
})
