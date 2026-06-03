import 'dotenv/config'
import express from 'express'
import { config } from './config/index.js'
import { qcmProxy } from './routes/qcm.routes.js'

const app = express()

// 1. Logger - Log all incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`)
  next()
})

// 2. Proxies - SINGLE ENTRY POINT
// We mount proxies BEFORE express.json() to ensure body streaming is not corrupted
// All routes starting with /api/qcms are handled by qcmProxy
app.use(config.services.qcm.prefix, qcmProxy)

// 3. Local Middlewares - Only for routes defined below (local to gateway)
app.use(express.json())

// 4. Gateway Health Check & Info
app.get('/', (req, res) => {
  res.json({ 
    service: 'API Gateway',
    status: 'UP',
    version: '1.0.0',
    routes: [
      { path: config.services.qcm.prefix, target: 'QCM-Service' }
    ]
  })
})

// 5. Start Server
app.listen(config.port, '0.0.0.0', () => {
  console.log(`\n🚀 API Gateway is running on http://localhost:${config.port}`)
  console.log(`📡 Proxying ${config.services.qcm.prefix}/* to ${config.services.qcm.url}${config.services.qcm.targetPath}/*\n`)
})
