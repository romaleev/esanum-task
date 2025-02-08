import { queue, queueEvents } from '#server/services/queueService'
import { spawn } from 'child_process'
import path from 'path'
import { promises as fs } from 'fs'
import { JobEventPayload, JobFailedEventPayload, GifJobData } from '#server/types/jobTypes'
import { isDev, config } from '#server/common/env'
import os from 'os'
import { Job, Worker } from 'bullmq'

const concurrency = isDev ? os.cpus().length - 1 : 1

new Worker(
	'gifQueue',
	async (job: Job<GifJobData>) => {
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
				'1',
				outputPath,
			])

			ffmpeg.stderr.on('data', (data: Buffer) => console.error(`FFmpeg: ${data.toString()}`))

			ffmpeg.on('close', async (code: number) => {
				if (code === 0) {
					console.log(`✅ GIF Created: ${outputPath}`)

					// Delete input file
					try {
						const inputPath = path.join(config.rootDir, job.data.filename)
						await fs.rm(inputPath)
						console.log(`🗑️ Deleted: ${inputPath}`)
					} catch (err) {
						console.error(`❌ Failed to delete file: ${err}`)
					}
					resolve(outputPath)
				} else {
					console.error(`❌ FFmpeg failed with exit code: ${code}`)
					reject(new Error(`FFmpeg failed with code ${code}`))
				}
			})
		})
	},
	{
		connection: { host: config.redisHost, port: Number(config.redisPort) },
		limiter: {
			max: 1000,
			duration: 60000,
		},
		concurrency,
	},
)

if (isDev) {
	console.log('🔧 [WORKER] Worker script started!!')

	queueEvents.on('completed', async (args: JobEventPayload) => {
		const completedJob = await queue.getJob(args.jobId) // 🔹 Получаем полный `Job`
		if (completedJob) {
			console.log(`🎉 [WORKER] Job completed - ID: ${completedJob.id}`)
		}
	})

	queueEvents.on('failed', async (args: JobFailedEventPayload) => {
		console.error(`❌ [WORKER] Job failed - ID: ${args.jobId}, Error: ${args.failedReason}`)
	})

	queueEvents.on('error', (error: Error) => {
		console.error(`❌ [WORKER] Queue error: ${error.message}`)
	})

	queueEvents.on('waiting', (args: JobEventPayload) => {
		console.log(`🔸 [WORKER] Job waiting - ID: ${args.jobId}`)
	})

	queueEvents.on('active', async (args: JobEventPayload) => {
		const activeJob = await queue.getJob(args.jobId)
		if (activeJob) {
			console.log(`🔵 [WORKER] Job active - ID: ${activeJob.id}`)
		}
	})
}
