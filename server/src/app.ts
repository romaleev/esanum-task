import express, { Request, Response } from 'express'
import cors from 'cors'
import uploadRoutes from '#server/routes/upload'
import statusRoutes from '#server/routes/status'
import path from 'path'
import { rootDir } from '#server/common/env'

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/gif', express.static(path.join(rootDir)))

app.use('/api', uploadRoutes)
app.use('/api', statusRoutes)

app.get('/', (request: Request, response: Response) => {
	response.send('MP4 to GIF Service Running 🚀')
})

export default app
