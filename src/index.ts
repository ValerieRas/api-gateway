import 'dotenv/config'
import express from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'


const app = express()

// Configuration du proxy pour le qcm-service
app.use(
  '/api/qcms',
  createProxyMiddleware({
    target: 'http://localhost:3001',
    changeOrigin: true,
    pathRewrite: {
      '^/api/qcms': '/qcms', // Remplace /api/qcms par /qcms
    },
  })
)

app.use(express.json())


app.get('/', (req, res) => {
  res.json({ message: 'Welcome to QCM API' })
})


const PORT :number = process.env.PORT ? Number(process.env.PORT) : 3000

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})


