import fs from 'fs'
import path from 'path'
import cron from 'node-cron'
import { maxFileAgeMin } from '#server/common/env'

const UPLOADS_DIR = path.join(process.cwd(), 'uploads')
const MAX_FILE_AGE_MS = parseInt(maxFileAgeMin) * 60 * 1000 // 10min

/**
 * Deletes old files from the uploads directory based on modification time.
 */
const runCleanupTask = (): void => {
	console.log('🧹 Running cleanup task...')
	try {
		const files = fs.readdirSync(UPLOADS_DIR)
		files.forEach((file) => {
			const filePath = path.join(UPLOADS_DIR, file)
			const fileStat = fs.statSync(filePath)
			if (Date.now() - fileStat.mtimeMs > MAX_FILE_AGE_MS) {
				fs.unlinkSync(filePath)
				console.log(`🗑️ Deleted: ${filePath}`)
			}
		})
	} catch (error) {
		console.error('❌ Cleanup error:', error)
	}
}

/**
 * Starts the cleanup cron job, running every 30 minutes.
 */
export const startCleanupScheduler = (): void => {
	cron.schedule(`*/${maxFileAgeMin} * * * *`, () => {
		console.log('⏳ Running scheduled cleanup...')
		runCleanupTask()
	})
	console.log(`🕒 Scheduled cleanup every ${maxFileAgeMin} minutes using cron`)
}
