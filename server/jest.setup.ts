process.env.NODE_ENV = 'development'

import { queue } from '#server/services/queueService'

beforeAll(async () => {
	await queue.obliterate({ force: true })
	await queue.clean(0, 'completed')
	await queue.clean(0, 'failed')
	await queue.clean(0, 'wait')
})

afterAll(async () => {
	await queue.close() // Ensure Redis queue is closed
})
