import { Router } from 'express'
import { streamJobStatus } from '#server/controllers/statusController'

const router = Router()

router.get('/status/:jobId', streamJobStatus)

export default router
