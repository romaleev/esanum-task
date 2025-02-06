import { queue } from '#server/services/queueService'

afterAll(async () => {
	await queue.close() // Ensure Redis queue is closed
})
