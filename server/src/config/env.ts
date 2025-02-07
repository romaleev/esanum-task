import dotenv from 'dotenv'
dotenv.config()

export const isDev = process.env.NODE_ENV === 'development'

export const config = {
	port: process.env.PORT || 3000,
	redisHost: process.env.REDIS_HOST || '127.0.0.1',
	redisPort: process.env.REDIS_PORT || '6379',
	maxUploadFileSize: process.env.MAX_UPLOAD_FILE_SIZE_MB || '10',
	maxFileAgeMin: process.env.MAX_FILE_AGE_MIN || '10',
}
