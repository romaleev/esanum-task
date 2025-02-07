import dotenv from 'dotenv'

// warning: .env & .env.production kept in git for test purposes

dotenv.config({ path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env' })

export const isDev = true // process.env.NODE_ENV === 'development'

export const config = {
	port: process.env.PORT || 3000,
	redisHost: process.env.REDIS_HOST || '127.0.0.1',
	redisPort: process.env.REDIS_PORT || '6379',
	maxUploadFileSize: process.env.MAX_UPLOAD_FILE_SIZE_MB || '10',
	maxFileAgeMin: process.env.MAX_FILE_AGE_MIN || '10',
}
