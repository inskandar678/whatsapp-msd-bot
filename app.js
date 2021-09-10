const { Client, MessageMedia } = require('whatsapp-web.js');
const express = require('express');
const { body, validationResult } = require('express-validator');
const socketIO = require('socket.io');
const qrcode = require('qrcode');
const http = require('http');
const fs = require('fs');
const { phoneNumberFormatter } = require('./helpers/formatter');

const axios = require('axios');
const port = process.env.PORT || 8000;
const mime = require('mime-types');



const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));


const SESSION_FILE_PATH = './whatsapp-session.json';
let sessionCfg;
if (fs.existsSync(SESSION_FILE_PATH)) {
  sessionCfg = require(SESSION_FILE_PATH);
}

app.get('/', (req, res) => {
  res.sendFile('index.html', {
    root: __dirname
  });
});

const client = new Client({
  restartOnAuthFail: true,
  puppeteer: {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process', // <- this one doesn't works in Windows
      '--disable-gpu'
    ],
  },
  session: sessionCfg
});


client.initialize();

// Socket IO
io.on('connection', function(socket) {
  socket.emit('message', 'Menghubungkan....');

  client.on('qr', (qr) => {
    console.log('QR RECEIVED', qr);
    qrcode.toDataURL(qr, (err, url) => {
      socket.emit('qr', url);
      socket.emit('message', 'QR Code Diterima,silahkan di scan !');
    });
  });

  client.on('ready', () => {
    socket.emit('ready', 'Whatsapp Bot terhubung!');
    socket.emit('message', 'Whatsapp Bot terhubung!');
  });

  client.on('authenticated', (session) => {
    socket.emit('authenticated', 'Whatsapp di auntentikasi!');
    socket.emit('message', 'Whatsapp di auntentikasi!');
    console.log('AUTHENTICATED', session);
    sessionCfg = session;
    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function(err) {
      if (err) {
        console.error(err);
      }
    });
  });

  client.on('auth_failure', function(session) {
    socket.emit('message', 'autentikasi gagal,memulai ulang');
  });

  client.on('disconnected', (reason) => {
    socket.emit('message', 'Whatsapp Bot terputus!');
    fs.unlinkSync(SESSION_FILE_PATH, function(err) {
        if(err) return console.log(err);
        console.log('Session file deleted!');
    });
    client.destroy();
    client.initialize();
  });
});

//pesan//
client.on('message', message => {
	if(message.body === 'Ping') {
		message.reply('halo');
	}
});

client.on('message', message => {//SALAM//
	if(message.body === 'Assalamualaikum') {
		message.reply("Wa'alaikumssalam");
		client.sendMessage(message.from, 'ada yang bisa kami bantu?');
	}
});

client.on('message', message => {//SALAM//
	if(message.body === 'assalamualaikum') {
		message.reply("Wa'alaikumssalam");
		client.sendMessage(message.from, 'ada yang bisa kami bantu?');
	}
});



client.on('message', message => { //PAGI//
	if(message.body.includes("selamat pagi")) {
		message.reply('Selamat pagi');
		client.sendMessage(message.from, 'ada yang bisa kami bantu?');
	}else
		if(message.body === 'pagi') {
		message.reply('Selamat pagi');
		client.sendMessage(message.from, 'ada yang bisa kami bantu?');
	}else
		if(message.body === 'Pagi') {
		message.reply('Selamat pagi');
		client.sendMessage(message.from, 'ada yang bisa kami bantu?');	
	}else
		if(message.body.includes('Selamat Pagi')) {
		message.reply('Selamat pagi');
		client.sendMessage(message.from, 'ada yang bisa kami bantu?');
	}else
		if(message.body === 'pgi') {
		message.reply('Selamat pagi');
		client.sendMessage(message.from, 'ada yang bisa kami bantu?');	
		}	
});

client.on('message', message => { //SIANG//
	if(message.body.includes("selamat siang")) {
		message.reply('Selamat siang');
		client.sendMessage(message.from, 'ada yang bisa kami bantu?');
	}else
		if(message.body === 'siang') {
		message.reply('Selamat siang');
		client.sendMessage(message.from, 'ada yang bisa kami bantu?');
	}else
		if(message.body === 'Siang') {
		message.reply('Selamat siang');
		client.sendMessage(message.from, 'ada yang bisa kami bantu?');	
	}else
		if(message.body.includes('Selamat Siang')) {
		message.reply('Selamat siang');
		client.sendMessage(message.from, 'ada yang bisa kami bantu?');
	
		}	
});


client.on('message', message => { //SORE//
	if(message.body.includes("selamat sore")) {
		message.reply('Selamat sore');
		client.sendMessage(message.from, 'ada yang bisa kami bantu?');
	}else
		if(message.body === 'sore') {
		message.reply('Selamat sore');
		client.sendMessage(message.from, 'ada yang bisa kami bantu?');
	}else
		if(message.body === 'Sore') {
		message.reply('Selamat sore');
		client.sendMessage(message.from, 'ada yang bisa kami bantu?');	
	}else
		if(message.body.includes('Selamat Sore')) {
		message.reply('Selamat sore');
		client.sendMessage(message.from, 'ada yang bisa kami bantu?');
	}else
		if(message.body === 'sre') {
		message.reply('Selamat sore');
		client.sendMessage(message.from, 'ada yang bisa kami bantu?');	
		}	
});


client.on('message', message => { //MALAM//
	if(message.body.includes("selamat malam")) {
		message.reply('Selamat malam');
		client.sendMessage(message.from, 'ada yang bisa kami bantu?');
	}else
		if(message.body === 'malam') {
		message.reply('Selamat malam');
		client.sendMessage(message.from, 'ada yang bisa kami bantu?');
	}else
		if(message.body === 'Malam') {
		message.reply('Selamat malam');
		client.sendMessage(message.from, 'ada yang bisa kami bantu?');	
	}else
		if(message.body.includes('Selamat mMalam')) {
		message.reply('Selamat malam');
		client.sendMessage(message.from, 'ada yang bisa kami bantu?');
	}else
		if(message.body === 'sre') {
		message.reply('Selamat malam');
		client.sendMessage(message.from, 'ada yang bisa kami bantu?');	
		}	
});


client.on('message', message => { //PING//
	if(message.body === "ping") {
		message.reply('iye');
		client.sendMessage(message.from, 'ada yang bisa kami bantu?');
	}else
		if(message.body === 'P') {
		message.reply('iye');
		client.sendMessage(message.from, 'ada yang bisa kami bantu?');
	}else
		if(message.body === 'p') {
		message.reply('iye');
		client.sendMessage(message.from, 'ada yang bisa kami bantu?');	
	}else
		if(message.body.includes('PING')) {
		message.reply('iye');
		client.sendMessage(message.from, 'ada yang bisa kami bantu?');
	}else
		if(message.body === 'Ping') {
		message.reply('iye');
		client.sendMessage(message.from, 'ada yang bisa kami bantu?');	
	}
});


client.on('message', message => { //HALO//
	if(message.body === "halo") {
		message.reply('iye');
		client.sendMessage(message.from, 'ada yang bisa kami bantu?');
	}else
		if(message.body === 'Halo') {
		message.reply('iye');
		client.sendMessage(message.from, 'ada yang bisa kami bantu?');	
	}
});

//end of pesan//




server.listen(port, function() {
	console.log('App running on *:' + port);
});