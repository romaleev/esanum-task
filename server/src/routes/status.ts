import { Router } from 'express'
import { getJobStatus } from '#server/controllers/statusController'

const router = Router()

router.get('/status/:jobId', getJobStatus)

export default router
