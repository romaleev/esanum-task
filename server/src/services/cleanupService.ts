import fs from 'fs'
import path from 'path'
import cron from 'node-cron'
import { config, isDev } from '#server/config/env'

const UPLOADS_DIR = path.join(process.cwd(), 'uploads')
const MAX_FILE_AGE_MS = parseInt(config.maxFileAgeMin) * 60 * 1000 // 10min

/**
 * Deletes old files from the uploads directory based on modification time.
 */
function runCleanupTask(): void {
	if (isDev) console.log('🧹 Running cleanup task...')
	try {
		const files = fs.readdirSync(UPLOADS_DIR)
		files.forEach((file) => {
			const filePath = path.join(UPLOADS_DIR, file)
			const fileStat = fs.statSync(filePath)
			if (Date.now() - fileStat.mtimeMs > MAX_FILE_AGE_MS) {
				fs.unlinkSync(filePath)
				if (isDev) console.log(`🗑️ Deleted: ${filePath}`)
			}
		})
	} catch (error) {
		console.error('❌ Cleanup error:', error)
	}
}

/**
 * Starts the cleanup cron job, running every 30 minutes.
 */
export function startCleanupScheduler(): void {
	cron.schedule(`*/${config.maxFileAgeMin} * * * *`, () => {
		if (isDev) console.log('⏳ Running scheduled cleanup...')
		runCleanupTask()
	})
	if (isDev) console.log(`🕒 Scheduled cleanup every ${config.maxFileAgeMin} minutes using cron`)
}
