const { Client, LocalAuth } = require('whatsapp-web.js')
const express = require('express')
const { Server } = require('socket.io')
const http = require('http')
const qrcode = require('qrcode-terminal')

const app = express()
const server = http.createServer(app)
const io = new Server(server, { cors: { origin: '*' } })

app.use(express.json())

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] },
})

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true })
  console.log('Scan QR code above with WhatsApp')
})

client.on('ready', () => {
  console.log('WhatsApp client is ready!')
  io.emit('ready', { status: 'connected' })
})

client.on('message', async (msg) => {
  console.log(`Message from ${msg.from}: ${msg.body}`)

  try {
    await axios.post('http://localhost:8000/api/whatsapp/webhook', {
      from: msg.from.replace('@c.us', ''),
      body: msg.body,
      timestamp: msg.timestamp,
    })
  } catch (err) {
    console.error('Error sending to backend:', err.message)
  }
})

app.post('/send', async (req, res) => {
  const { to, message } = req.body
  try {
    const formattedNumber = to.includes('@c.us') ? to : `${to}@c.us`
    const response = await client.sendMessage(formattedNumber, message)
    res.json({ status: 'sent', id: response.id.id })
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message })
  }
})

app.get('/status', (req, res) => {
  res.json({ connected: client.info ? true : false, phone: client.info?.wid?.user || null })
})

client.initialize()

const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`WhatsApp service running on port ${PORT}`)
})

const axios = require('axios')
