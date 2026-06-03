export const config = {
  port: process.env.PORT ? Number(process.env.PORT) : 3000,
  services: {
    qcm: {
      url: process.env.QCM_SERVICE_URL || 'http://localhost:3001',
      prefix: '/api/qcms',
      targetPath: '/qcms'
    }
  }
}
