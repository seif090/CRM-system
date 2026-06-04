const { app, BrowserWindow } = require('electron')
const path = require('path')
const http = require('http')
const fs = require('fs')
const { URL } = require('url')

const APP_URL = process.env.APP_URL

function findFrontendDist() {
  const candidates = [
    path.join(__dirname, '..', 'frontend', 'dist'),
    path.join(__dirname, '..', '..', '..', 'frontend', 'dist'),
    path.join(process.cwd(), 'frontend', 'dist'),
    path.join(path.dirname(process.execPath), '..', 'frontend', 'dist'),
  ]
  for (const p of candidates) {
    if (fs.existsSync(path.join(p, 'index.html'))) return p
  }
  return null
}

const FRONTEND_DIST = findFrontendDist()
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'

function serveDist(port = 3000) {
  const mimeTypes = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.map': 'application/json' }

  const server = http.createServer((req, res) => {
    if (req.url.startsWith('/api')) {
      try {
        const u = new URL(BACKEND_URL)
        const opts = { hostname: u.hostname, port: parseInt(u.port) || 80, path: req.url, method: req.method, headers: { ...req.headers, host: u.host } }
        const proxy = http.request(opts, (pres) => { res.writeHead(pres.statusCode, pres.headers); pres.pipe(res) })
        proxy.on('error', () => { res.writeHead(502, { 'Content-Type': 'text/plain' }); res.end('Backend unavailable') })
        req.pipe(proxy)
      } catch (e) {
        res.writeHead(502, { 'Content-Type': 'text/plain' }); res.end('Backend unavailable')
      }
      return
    }

    const urlPath = req.url.split('?')[0].split('#')[0]
    let filePath = path.join(FRONTEND_DIST, urlPath === '/' ? 'index.html' : urlPath)

    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        fs.readFile(path.join(FRONTEND_DIST, 'index.html'), (err2, data) => {
          if (err2) { res.writeHead(404, { 'Content-Type': 'text/plain' }); res.end('Not found') }
          else { res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); res.end(data) }
        })
      } else {
        const ext = path.extname(filePath)
        fs.readFile(filePath, (err3, data) => {
          if (err3) { res.writeHead(500); res.end('Error') }
          else { res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' }); res.end(data) }
        })
      }
    })
  })

  return new Promise((resolve, reject) => {
    server.listen(port, '127.0.0.1', () => resolve(`http://127.0.0.1:${port}`))
    server.on('error', reject)
  })
}

function isServerReachable(urlStr) {
  return new Promise((resolve) => {
    try {
      const u = new URL(urlStr)
      const req = http.get({ hostname: u.hostname, port: parseInt(u.port) || 80, path: '/', timeout: 3000 }, (res) => { resolve(true); res.resume() })
      req.on('error', () => resolve(false))
      req.on('timeout', () => { req.destroy(); resolve(false) })
    } catch { resolve(false) }
  })
}

const errorHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Segoe UI',sans-serif;background:#f5f5f5;display:flex;align-items:center;justify-content:center;height:100vh;padding:20px}
.card{background:#fff;padding:40px;border-radius:12px;box-shadow:0 2px 20px rgba(0,0,0,.1);text-align:center;max-width:480px}
h2{color:#d32f2f;margin-bottom:12px}
p{color:#666;margin-bottom:8px;line-height:1.6}
code{background:#f0f0f0;padding:2px 6px;border-radius:4px;font-size:14px}
.btn{display:inline-block;margin-top:16px;padding:10px 24px;background:#1976d2;color:#fff;text-decoration:none;border-radius:6px;cursor:pointer}
</style></head><body>
<div class="card"><h2>⚠️ Cannot Connect</h2>
<p>The app tried to reach your server but it is not responding.</p>
<p>Try running: <code>cd frontend && npm run dev</code></p>
<p>Or set <code>APP_URL</code> to a remote server URL.</p>
<button class="btn" onclick="location.reload()">Retry</button>
</div></body></html>`

async function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    title: 'ERP & CRM System',
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  let targetUrl = APP_URL

  if (!targetUrl && FRONTEND_DIST) {
    try {
      targetUrl = await serveDist(3000)
      console.log(`Serving frontend from ${FRONTEND_DIST}`)
    } catch (e) {
      console.error('Failed to start local server:', e.message)
    }
  }

  win.webContents.on('did-fail-load', (e, code, desc) => {
    console.error(`Page load failed: ${code} ${desc}`)
    win.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(errorHtml)}`)
  })

  win.webContents.on('console-message', (e, level, msg) => {
    if (level >= 2) console.error(`[renderer] ${msg}`)
  })

  if (targetUrl) {
    const reachable = await isServerReachable(targetUrl)
    if (reachable) {
      win.loadURL(targetUrl)
    } else {
      console.error(`Server not reachable: ${targetUrl}`)
      win.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(errorHtml)}`)
    }
  } else {
    console.error('No server available. FRONTEND_DIST:', FRONTEND_DIST)
    win.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(errorHtml)}`)
  }

  if (process.env.NODE_ENV === 'development') {
    win.webContents.openDevTools()
  }
}

app.whenReady().then(createWindow)
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit() })
app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow() })
