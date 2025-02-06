import express, { Request, Response } from 'express'
import cors from 'cors'
import uploadRoutes from '#server/routes/upload'
import statusRoutes from '#server/routes/status'

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api', uploadRoutes)
app.use('/api', statusRoutes)

app.get('/', (request: Request, response: Response) => {
	response.send('MP4 to GIF Service Running 🚀')
})

export default app
