import { queue } from '#server/services/queueService'
import { spawn } from 'child_process'
import path from 'path'
import { promises as fs } from 'fs'
import { GifJob } from '#server/types/jobTypes'
import { isDev, config } from '#server/common/env'
import os from 'os'

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

const cores = os.cpus().length - 1

queue.process(cores, (job: GifJob, done) => {
	if (isDev) console.log(`🔔 [WORKER] Job received - ID: ${job.id}`)
	const inputPath = path.join(config.rootDir, job.data.filename)
	const outputPath = path.join(config.rootDir, `${job.id}.gif`)

	console.log(`🎬 [WORKER] Processing input file ${inputPath}`)
	console.log(`🎬 [WORKER] Output file path: ${outputPath}`)

	if (isDev) console.log(`🎬 [WORKER] Processing job - ID: ${job.id}`)

	return new Promise<string>((resolve, reject) => {
		const ffmpeg = spawn('ffmpeg', [
			'-y',
			'-i',
			inputPath,
			'-vf',
			'scale=-1:400,fps=5',
			'-preset',
			'ultrafast',
			'-threads',
			'auto',
			outputPath,
		])

		// ffmpeg.stderr.on('data', (data: Buffer) => console.error(`FFmpeg: ${data.toString()}`))

		ffmpeg.on('close', async (code: number) => {
			if (code === 0) {
				console.log(`✅ GIF Created: ${outputPath}`)

				// Delete input file
				try {
					await fs.rm(inputPath)
					console.log(`🗑️ Deleted: ${inputPath}`)
				} catch (err) {
					console.error(`❌ Failed to delete file: ${err}`)
				}

				done()
				resolve(outputPath)
			} else {
				console.error(`❌ FFmpeg failed with exit code: ${code}`)
				reject(new Error(`FFmpeg failed with code ${code}`))
			}
		})
		// exec(
		// 	`ffmpeg -y -i ${inputPath} -vf "scale=-1:400,fps=5" ${outputPath} -preset ultrafast -threads auto`,
		// 	async (error) => {
		// 		if (error) {
		// 			console.error(`FFmpeg Error: ${error.message}`)
		// 			reject(error)
		// 		} else {
		// 			console.log(`GIF Created: ${outputPath}`)
		// 			done()
		// 			resolve(outputPath)
		// 		}
		// 	},
		// )
	})
})
