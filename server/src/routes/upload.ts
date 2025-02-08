import { NextFunction, Router, Request, Response } from 'express'
import multer from 'multer'
import { produceJob } from '#server/controllers/uploadController'
import { validateUpload } from '#server/middleware/validateUpload'
import { config } from '#server/common/env'

const router = Router()

const upload = multer({
	limits: { fileSize: parseInt(config.maxUploadFileSize) * 1024 * 1024 },
	dest: config.rootDir,
}).single('file')

router.post(
	'/upload',
	(req: Request, res: Response, next: NextFunction) => {
		upload(req, res, (err) => {
			if (err instanceof multer.MulterError) {
				if (err.code === 'LIMIT_FILE_SIZE') {
					console.log('File too large error')
					return res.status(400).json({ error: 'File too large' }) // ✅ Correctly return 400
				}
			} else if (err) {
				console.log('Upload failed:', err.message)
				return res.status(500).json({ error: `Upload failed: ${err.message}` }) // ✅ Handle other errors
			}
			next()
		})
	},
	validateUpload,
	produceJob,
)

export default router
