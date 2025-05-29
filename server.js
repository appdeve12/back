require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// WhatsApp Client Setup
const { Client, LocalAuth } = require('whatsapp-web.js');

const sessionIds = ['7985490508', '9540215846'];
const clients = {};

sessionIds.forEach(id => {
const client = new Client({
  authStrategy: new LocalAuth({ 
    clientId: id 
  }),
  puppeteer: {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process',
      '--disable-gpu'
    ]
  }
});

console.log("helo")
  client.on('ready', () => console.log(`✅ WhatsApp client ${id} ready`));
  client.on('auth_failure', () => console.log(`❌ WhatsApp client ${id} auth failed`));
  client.initialize();

  clients[id] = client;
});

// Express App Setup
const uploadRoutes = require('./routes/uploadRoutes');
const authRoutes = require('./routes/authRoutes');
const whatsappRoutes = require('./routes/whatsappRoutes');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/auth', authRoutes);
app.use('/whatsapp', whatsappRoutes);
app.use('/uploads', express.static('uploads')); // Serve static files
app.use('/api', uploadRoutes);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
