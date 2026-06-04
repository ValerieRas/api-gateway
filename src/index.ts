import 'dotenv/config'
import express from 'express'
import type { NextFunction, Request, Response } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';


const app = express()

const PORT :number = process.env.PORT ? Number(process.env.PORT) : 3000
const PORTQCM :number = process.env.PORTQCM ? Number(process.env.PORTQCM) : 3001


const proxyMiddleware = createProxyMiddleware<Request, Response>({
  target: `http://localhost:${PORTQCM}`,
  changeOrigin: true,
  pathRewrite: {'^/api/qcms': '/qcms'}
});

app.use('/api', proxyMiddleware);


app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
