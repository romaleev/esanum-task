import { queue } from '#server/services/queueService'
import { exec } from 'child_process'
import path from 'path'
import { GifJob } from '#server/types/jobTypes'
import { isDev } from '#server/config/env'

if (isDev) {
	console.log('🔧 [WORKER] Worker script started!!')

	queue.on('completed', (job: GifJob) => {
		console.log(`🎉 [WORKER] Job completed - ID: ${job.id}`)
	})

	queue.on('failed', (job: GifJob, error) => {
		console.error(`❌ [WORKER] Job failed - ID: ${job.id}, Error: ${error.message}`)
	})

	queue.on('error', (error: Error) => {
		console.error(`❌ [WORKER] Queue error: ${error.message}`)
	})

	queue.on('waiting', (jobId: GifJob) => {
		console.log(`🔸 [WORKER] Job waiting - ID: ${jobId}`)
	})

	queue.on('active', (job: GifJob) => {
		console.log(`🔵 [WORKER] Job active - ID: ${job.id}`)
	})
}

queue.process((job: GifJob, done) => {
	if (isDev) console.log(`🔔 [WORKER] Job received - ID: ${job.id}`)
	const inputPath = job.data.filePath
	const outputPath = path.join('uploads', `${job.id}.gif`)

	if (isDev) console.log(`🎬 [WORKER] Processing job - ID: ${job.id}`)

	return new Promise<string>((resolve, reject) => {
		exec(`ffmpeg -y -i ${inputPath} -vf "scale=-1:400,fps=5" ${outputPath}`, async (error) => {
			if (error) {
				console.error(`FFmpeg Error: ${error.message}`)
				reject(error)
			} else {
				console.log(`GIF Created: ${outputPath}`)
				done()
				resolve(outputPath)
			}
		})
	})
})
