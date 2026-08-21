import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Use PORT provided by Railway, or fallback to 8080
const PORT = process.env.PORT || 8080;

// The backend endpoint target
const TARGET_URL = process.env.VITE_API_TARGET_URL || 'https://admin-moderator-backend-staging.up.railway.app';

// 1. Proxy /api requests to backend
app.use('/api', createProxyMiddleware({
  target: TARGET_URL,
  changeOrigin: true,
  logLevel: 'info',
}));

// 2. Serve Vite production build assets
app.use(express.static(path.join(__dirname, 'dist')));

// 3. Fallback all other routes to index.html (supports React Router history/client-side routing)
app.get('/*splat', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  console.log(`Proxying /api requests to: ${TARGET_URL}`);
});
