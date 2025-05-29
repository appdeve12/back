const { Client, LocalAuth } = require('whatsapp-web.js');

const sessionIds = ['7985490508','9540215846'];  
const clients = {};

sessionIds.forEach(id => {
  const client = new Client({
    authStrategy: new LocalAuth({ clientId: id }),
    puppeteer: { headless: true },
  });

  client.on('ready', () => console.log(`✅ WhatsApp client ${id} ready`));
  client.on('auth_failure', () => console.log(`❌ WhatsApp client ${id} auth failed`));
  client.initialize();

  clients[id] = client;
});

module.exports = { clients, sessionIds };
