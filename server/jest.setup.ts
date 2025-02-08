process.env.NODE_ENV = 'development'

import { queue, queueEvents } from '#server/services/queueService'

beforeAll(async () => {
	await queue.drain()
	await queue.clean(0, 1000, 'completed')
	await queue.clean(0, 1000, 'failed')
	await queue.clean(0, 1000, 'wait')
	await queue.clean(0, 1000, 'delayed')
})

afterAll(async () => {
	await queue.close()
	await queueEvents.close()
})
