import { Request, Response, NextFunction } from 'express'
import ffmpeg from 'fluent-ffmpeg'
import ffmpegPath from '@ffmpeg-installer/ffmpeg'

ffmpeg.setFfmpegPath(ffmpegPath.path)

/**
 * Middleware to validate MP4 file format, resolution, and duration.
 */
export const validateUpload = (req: Request, res: Response, next: NextFunction): void => {
	if (!req.file) {
		console.log('No file uploaded')
		res.status(400).json({ error: 'No file uploaded' })
		return
	}

	const filePath = req.file.path
	const allowedMimeTypes = ['video/mp4']

	// Validate MIME type
	if (!allowedMimeTypes.includes(req.file.mimetype)) {
		console.log(`Invalid file format: ${req.file.mimetype}`)
		res.status(400).json({ error: 'Invalid file format. Only MP4 is allowed.' })
		return
	}

	// Validate resolution & duration
	ffmpeg.ffprobe(filePath, (err, metadata) => {
		if (err) {
			console.log('Failed to analyze video file', err)
			res.status(500).json({ error: 'Failed to analyze video file' })
			return
		}

		const { width, height, duration } = metadata.streams.find((s) => s.codec_type === 'video') || {}

		if (!width || !height || !duration) {
			console.log('Invalid MP4 file')
			res.status(400).json({ error: 'Invalid MP4 file' })
			return
		}

		if (width > 1024 || height > 768) {
			console.log(`Resolution exceeds limit: ${width}x${height}`)
			res.status(400).json({ error: 'Resolution exceeds 1024x768 limit' })
			return
		}

		if (parseInt(duration) > 10) {
			console.log(`Video duration exceeds limit: ${duration} seconds`)
			res.status(400).json({ error: 'Video duration exceeds 10 seconds limit' })
			return
		}

		console.log('Validation passed')
		next() // ✅ Validation passed
	})
}
