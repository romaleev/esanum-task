import { Request, Response, NextFunction } from 'express'
import ffmpeg from 'fluent-ffmpeg'
import ffmpegPath from '@ffmpeg-installer/ffmpeg'

ffmpeg.setFfmpegPath(ffmpegPath.path)

/**
 * Middleware to validate MP4 file format, resolution, and duration.
 */
export const validateUpload = (req: Request, res: Response, next: NextFunction): void => {
	if (!req.file) {
		res.status(400).json({ error: 'No file uploaded' })
		return
	}

	const filePath = req.file.path
	const allowedMimeTypes = ['video/mp4']

	// Validate MIME type
	if (!allowedMimeTypes.includes(req.file.mimetype)) {
		res.status(400).json({ error: 'Invalid file format. Only MP4 is allowed.' })
		return
	}

	// Validate resolution & duration
	ffmpeg.ffprobe(filePath, (err, metadata) => {
		if (err) {
			res.status(500).json({ error: 'Failed to analyze video file' })
			return
		}

		const { width, height, duration } = metadata.streams.find((s) => s.codec_type === 'video') || {}

		if (!width || !height || !duration) {
			res.status(400).json({ error: 'Invalid MP4 file' })
			return
		}

		if (width > 1024 || height > 768) {
			res.status(400).json({ error: 'Resolution exceeds 1024x768 limit' })
			return
		}

		if (parseInt(duration) > 10) {
			res.status(400).json({ error: 'Video duration exceeds 10 seconds limit' })
			return
		}

		next() // ✅ Validation passed
	})
}
