import app from '#server/app'
import { config } from '#server/common/env'
import { startCleanupScheduler } from '#server/services/cleanupService'

const PORT = config.port || 3000

app.listen(PORT, () => {
	startCleanupScheduler()
	console.log(`Server running on port ${PORT}`)
})
