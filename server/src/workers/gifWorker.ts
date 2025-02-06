import { queue } from '#server/services/queueService'
import { exec } from 'child_process'
import path from 'path'

queue.process(async (job) => {
	const inputPath = job.data.filePath
	const outputPath = path.join('uploads', `${job.id}.gif`)

	return new Promise<string>((resolve, reject) => {
		exec(`ffmpeg -i ${inputPath} -vf "scale=-1:400,fps=5" ${outputPath}`, async (error) => {
			if (error) {
				console.error(`FFmpeg Error: ${error.message}`)
				await job.moveToFailed({ message: error.message })
				reject(error)
			} else {
				console.log(`GIF Created: ${outputPath}`)
				await job.moveToCompleted(outputPath)
				resolve(outputPath)
			}
		})
	})
})
