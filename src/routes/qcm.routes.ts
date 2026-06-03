import type { Response } from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'
import { config } from '../config/index.js'

export const qcmProxy = createProxyMiddleware({
  target: config.services.qcm.url,
  changeOrigin: true,
  // When mounted at '/api/qcms' via app.use:
  // - A request to /api/qcms has path '/' in the middleware context.
  // - A request to /api/qcms/123 has path '/123' in the middleware context.
  // We want to prepend '/qcms' to reach the target service's base path.
  pathRewrite: (path) => {
    const newPath = `/qcms${path}`.replace(/\/+/g, '/') // Ensure no double slashes
    return newPath
  },
  on: {
    error: (err, req, res) => {
      console.error(`[Proxy Error] QCM Service:`, err.message)
      if ('headersSent' in res && !res.headersSent) {
        (res as Response).status(502).json({ error: 'Bad Gateway', message: 'Failed to connect to QCM Service' })
      }
    },
    proxyReq: (proxyReq, req, res) => {
      console.log(`[Proxy Request] ${req.method} ${req.url} -> ${config.services.qcm.url}${proxyReq.path}`)
    }
  }
})
