import app from '#server/app'
import { serverPort } from '#server/common/env'
import { startCleanupScheduler } from '#server/services/cleanupService'

const PORT = serverPort || 3000

app.listen(PORT, () => {
	startCleanupScheduler()
	console.log(`Server running on port ${PORT}`)
})
