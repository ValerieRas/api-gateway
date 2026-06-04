import 'dotenv/config'
import express from 'express'
import type { NextFunction, Request, Response } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';


const app = express()

const PORT :number = process.env.PORT ? Number(process.env.PORT) : 3000
const PORTQCM :number = process.env.PORTQCM ? Number(process.env.PORTQCM) : 3001
const PORTAUTH :number = process.env.PORTAUTH ? Number(process.env.PORTAUTH) : 3002

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];

  if(req.method === 'GET') {
    return next();
  }

  if (!authHeader) {
    return res.status(401).json({ error: 'Autorisation manquante' });
  }
  
  const authResponse = await fetch(`http://localhost:${PORTAUTH}/users/me`, {
      method: 'GET',
      headers: { 
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      }
    });
      
    if (!authResponse.ok) {  
      res.status(401).json({ error: 'Unauthorized: Token invalide' , status: authResponse.status, statusText: authResponse.statusText});
      return;
    }
    else{
      const authData = await authResponse.json();
      req.headers['X-User-Id'] = authData.id.toString();
    }

  next();
};

const proxyMiddleware = createProxyMiddleware<Request, Response>({
  target: `http://localhost:${PORTQCM}/qcms`,
  changeOrigin: true,
});

const authProxyMiddleware = createProxyMiddleware<Request, Response>({
  target: `http://localhost:${PORTAUTH}/auth`,
  changeOrigin: true,
});


app.use('/api/auth', authProxyMiddleware);
app.use('/api/qcms', authMiddleware, proxyMiddleware);


app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
