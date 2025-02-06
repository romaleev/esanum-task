import app from '#server/app'
import { config } from '#server/config/env'

const PORT = config.port || 3000

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
