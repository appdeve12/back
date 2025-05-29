const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const sessionIds = ['7985490508', '9540215846']; // Replace with your actual numbers
const clients = {};

sessionIds.forEach(id => {
  const client = new Client({
    authStrategy: new LocalAuth({
  clientId: id,
  dataPath: `./sessions/${id}`  // Folder must be persistent
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

  client.on('qr', qr => {
    console.log(`Scan QR for number ${id}:`);
    qrcode.generate(qr, { small: true });
  });

  client.on('ready', () => {
    console.log(`✅ WhatsApp client ${id} is ready! Session saved.`);
  });

  client.on('auth_failure', msg => {
    console.error(`❌ Authentication failed for ${id}:`, msg);
  });

  client.initialize();
  clients[id] = client;
});

module.exports = { clients, sessionIds };
