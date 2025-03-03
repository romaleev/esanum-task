import dotenv from 'dotenv'

// warning: .env & .env.production kept in git for test purposes

dotenv.config({
	path: `../common/${process.env.NODE_ENV === 'production' ? '.env.production' : '.env'}`,
})

export const isDev = process.env.NODE_ENV === 'development'

export const clientPort = process.env.CLIENT_PORT || 4200
export const serverPort = process.env.SERVER_PORT || 3000
export const redisHost = process.env.REDIS_HOST || '127.0.0.1'
export const redisPort = process.env.REDIS_PORT || '6379'
export const maxUploadFileSize = process.env.MAX_UPLOAD_FILE_SIZE_MB || '10'
export const maxFileAgeMin = process.env.MAX_FILE_AGE_MIN || '10'
export const rootDir = process.env.ROOT_DIR || './uploads'
