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
		if(message.body.includes('Selamat malam')) {
		message.reply('Selamat malam');
		client.sendMessage(message.from, 'ada yang bisa kami bantu?');
	}else
		if(message.body === 'mlm') {
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

client.on('message', message => { //LIST HARGA RUBBER//
	if(message.body.includes("Rubber")) {
		message.reply("Untuk cek harga Rubber ketik: RUbbeR");
	}else
		if(message.body.includes("rubber")) {
		message.reply("Untuk cek harga Rubber ketik: RUbbeR");	
	}else
		if(message.body === 'RUbbeR') {
		message.reply("  _*List Harga Rubber KHANZA*_ \n - Rubber Khanza Doff White 1KG@65K \n - Rubber Khanza Doff Colour 1KG@65K \n - Rubber Khanza Eco White 1KG@60K \n - Rubber Khanza Eco Colour 1KG@60K \n - Rubber Khanza Eco Clear 1KG@60K \n - Rubber Khanza Glossy White 1KG@58K \n - Rubber Khanza Glossy Colour 1KG@58K \n - Rubber Khanza Gold 1KG@120K \n - Rubber Khanza Silver 1KG@110K \n - Rubber Unita White (U/goddie bag) 1KG@40K \n - Rubber Unita Colour (U/goodie bag) 1KG@40K \n - Rubber Unita Super White (U/Kaos ) 1KG@70K \n - Rubber Unita Colour (U/Kaos) 1KG@68K \n\n *Untuk Cek harga Rubber Matsui ketik: MRubbeR*");
	}else
		if(message.body === 'MRubbeR') {
		message.reply("  _*List Harga Rubber Matsui*_ \n - Matsui BR MJW White 1KG@110K \n - Matsui SW-W 0116 Super White 1KG@120K \n - Matsui BR MJB Clear 1KG@110K \n - Matsui Discharge 301 White/DW3 1KG@130K \n - Matsui Discharge 301 Clear/DC 1KG@130K \n - Matsui MJM Matt/Colour 1KG@110K \n - Matsui Strecth Matt/Colour 70 1KG@150K \n - Matsui Strecth White 701 1KG@150K \n - Matsui Strecth Clear 701 1KG@150K  \n\n *Untuk Cek harga Rubber Lucas ketik: LRubbeR*");
		}else
		if(message.body === 'LRubbeR') {
		message.reply("  _*List Harga Rubber Lucas*_ \n - Rubber Lucas CSC 5000/Colour 1KG@105K \n - Rubber Lucas CSC 5000/White 1KG@105K \n - Rubber Lucas CSC 5000/Clear 1KG@105K  \n\n *Untuk Cek harga Discharge Primus CDT ketik: PDischarGE*");
		}else
		if(message.body === 'PDischarGE') {
		message.reply("  _*List Harga Discharge Primus*_ \n - Discharge Primus Colour CDT 1KG@120K \n - Discharge Primus White CDW 1KG@120K ");
		
	}	
});
//End OF list Harga RUBBER//

client.on('message', message => { //LIST HARGA PLASTISOL//
	if(message.body.includes("Plastisol")) {
		message.reply("Untuk cek harga Plastisol ketik: PLasTisol");
	}else
		if(message.body.includes("plastisol")) {
		message.reply("Untuk cek harga Plastisol ketik: PLasTisol");	
	}else
		if(message.body === 'PLasTisol') {
		message.reply("  _*List Harga Plastisol Eco*_ \n - PS. Eco Black 1KG@85K \n - PS. Eco Brown 1KG@120K \n - PS. Eco Clear 1KG@120K \n - PS. Eco Clear HD 1KG@150K \n - PS. Eco Gold 1KG@190K \n - PS. Eco Green 1KG@110K \n - PS. Eco Green Flo 1KG@150K \n - PS. Eco Magenta Flo 1KG@150K \n - PS. Eco Orange Flo 1KG@150K \n - PS. Eco Orange 1KG@110K \n - PS. Eco Pink Flo 1KG@150K \n - PS. Eco Red 1KG@110K \n - PS. Eco Silver 1KG@180K \n - PS. Eco Violet 1KG@120K \n - PS. Eco White 1KG@85K \n - PS. Eco Yellow 1KG@95K \n - PS. Eco Yellow Flo 1KG@150K \n - PS. Eco Blue 1KG@100K \n - PS. Eco Blue FLo 500g@75K \n - PS. Eco Black 500g@48K \n - PS. Eco Clear 500g@60K \n - PS. Eco CLear HD 500g@60K \n - PS. Eco Gold 500g@100K \n - PS. Eco Green FLo 500g@75K \n - PS. Eco Magenta FLo 500g@75K \n - PS. Eco Orange FLo 500g@75K \n - PS. Eco Pink FLo 500g@75K \n - PS. Eco Violet 500g@65K \n - PS. Eco Yellow FLo 500g@75K \n\n *Untuk Cek harga Plastisol Unimate ketik: UPLasTisol* \n *Untuk Cek harga Plastisol K-PLAST ketik: KPLasTisol*");
		}else
		if(message.body === 'KPLasTisol') {
		message.reply("  _*List Harga Plastisol K-PLAST*_ \n - PS. K-PLAST Black 1KG@90K \n - PS. K-PLAST Blue 1KG@105K \n - PS. K-PLAST Green 1KG@115K \n - PS. K-PLAST Red 1KG@115K \n - PS. K-PLAST White 1KG@90K \n - PS. K-PLAST Yellow 1KG@100K \n - PS. K-PLAST Clear 500g@65K \n - PS. K-PLAST Clear HD 500g@0K \n - PS. K-PLAST Gold 500g@105K \n - PS. K-PLAST Silver 500g@105K \n - PS. K-PLAST Plastcharge Black 500g@90K \n - PS. K-PLAST Plastcharge Blue 500g@90K \n - PS. K-PLAST Plastcharge Red 500g@90K \n - PS. K-PLAST Plastcharge White 500g@90K \n - PS. K-PLAST Plastcharge Yellow 500g@90K \n - PS. K-PLAST Plastcharge Black 250g@55K \n - PS. K-PLAST Plastcharge Blue 250g@55K \n - PS. K-PLAST Plastcharge Red 250g@55K \n - PS. K-PLAST Plastcharge White 250g@55K \n - PS. K-PLAST Plastcharge Yellow 250g@55K \n - PS. K-PLAST Plastcharge FLo Green 250g@55K \n - PS. K-PLAST Plastcharge FLo Magenta 250g@55K \n - PS. K-PLAST Plastcharge FLo Orange 250g@55K \n - PS. K-PLAST Plastcharge FLo Pink 250g@55K \n - PS. K-PLAST Plastcharge FLo Yellow 250g@55K \n\n *Untuk Cek harga Plastisol Unimate ketik: UPLasTisol*");
		}else
		if(message.body === 'UPLasTisol') {
		message.reply("  _*List Harga Plastisol Unimate*_ \n - PS. Unimate As Black 1KG@100K \n - PS. Unimate As Blue 1KG@105K \n - PS. Unimate As Green 1KG@122K \n - PS. Unimate As Magenta 1KG@160K \n - PS. Unimate As Clear/U bubuk GID 1KG@135K \n - PS. Unimate As Orange 1KG@132K \n - PS. Unimate As Red  1KG@130K \n - PS. Unimate As R-White 1KG@100K \n - PS. Unimate As Yellow 1KG@115K \n - PS. Unimate As Violet 1KG@185K \n - PS. Unimate As Green Flo 1KG@150K \n - PS. Unimate As Pink Flo 1KG@150K \n - PS. Unimate JKR Plascahrge 1KG@182K \n - PS. Unimate As Black CMYK 1KG@130K \n - PS. Unimate As Cyan CMYK 1KG@130K \n - PS. Unimate As Magenta CMYK 1KG@130K \n - PS. Unimate As Yellow CMYK 1KG@130K \n - PS. Unimate As Gold 500g@150K \n - PS. Unimate JKR SP Flo Green 500g@120k \n - PS. Unimate JKR SP White 500g@85K \n - PS. Unimate JKR SP Flo Yellow 500g@130K \n\n *Untuk Cek harga Plastisol K-PLAST ketik: KPLasTisol*");
		
	}	
});
//End OF list Harga Plastisol//

client.on('message', message => { //LIST HARGA ALAT//
	if(message.body.includes("screen")) {
		message.reply("Untuk cek harga Screen ketik sesuai type 'ST77, ST120, ST61' Contoh: ST120");
	}else
		if(message.body.includes("Screen")) {
		message.reply("Untuk cek harga Screen ketik sesuai type 'ST77, ST120, ST61' Contoh: ST120");
	}else
		if(message.body.includes("Talang")) {
		message.reply("Untuk cek harga Screen ketik sesuai type 'ST77, ST120, ST61' Contoh: ST120");
	}else
		if(message.body.includes("talang")) {
		message.reply("Untuk cek harga Screen ketik sesuai type 'ST77, ST120, ST61' Contoh: ST120");
	}else
		if(message.body.includes("rakel")) {
		message.reply("Untuk cek harga Rakel ketik sesuai Model 'RaKel.S, RaKel.A' Contoh: RaKel.S");
	}else
		if(message.body.includes("Rakel")) {
		message.reply("Untuk cek harga Rakel ketik sesuai Model 'RaKel.S, RaKel.A' Contoh: RaKel.S");	
	}else
		if(message.body === 'ST77') {
		message.reply("  _*List Harga Screen T77*_ \n *Aluminium:* \n - Alu T77 40X60cm 1,6m @196K \n - Alu T77 40X60cm 1,3m @180K \n - Alu Kotak T77 40X60cm 1,2m @160K \n *Kayu:* \n - Kayu T77 40X60cm @85K \n - Kayu T77 40X50cm @80K");
    }else
		if(message.body === 'ST120') {
		message.reply("  _*List Harga Screen T120*_ \n *Aluminium:* \n - Alu T120 40X60cm 1,6m @228K \n - Alu T120 40X60cm 1,3m @210K \n - Alu Kotak T120 40X60cm 1,2m @180K \n *Kayu:* \n - Kayu T120 40X60cm @120K ");
	}else
		if(message.body === 'ST61') {
		message.reply("  _*List Harga Screen T61*_ \n *Aluminium:* \n - Alu T61 40X60cm 1,6m @190K \n - Alu T61 40X60cm 1,3m @170K \n - Alu Kotak T61 40X60cm 1,2m @150K \n *Kayu:* \n - Kayu T61 40X60cm @80K  \n - Kayu T61 40X50cm @75K");
	}else
		if(message.body === 'RaKel.S') {
		message.reply("  _*List Harga Rakel Alu model S*_  \n - Rakel Alu S 35cm @193K \n - Rakel Alu S 30cm @165K \n - Rakel Alu S 25cm @137K \n - Rakel Alu S 15cm @82K \n - Rakel Alu S 10cm @55K");
	}else
		if(message.body === 'RaKel.A') {
		message.reply("  _*List Harga Rakel Alu Biasa*_  \n - Rakel Alu 35cm @175K \n - Rakel Alu 30cm @135K \n - Rakel Alu 15cm @68K \n - Rakel Alu 10cm @45K");	
	}	
});
//End OF list Harga ALAT////

// simulates typing in the chat
client.on('message', async message => {   			
    if(message.body.includes("?")) {
        const chat = await message.getChat('');
        // simulates typing in the chat
        chat.sendStateTyping();
       } else if(message.body.includes("berapa")) {
        const chat = await message.getChat('');
		chat.sendStateTyping();
       } else if(message.body.includes("Berapa")) {
        const chat = await message.getChat('');
		chat.sendStateTyping();	
       } else if(message.body.includes("Harga")) {
        const chat = await message.getChat('');
		chat.sendStateTyping();	
       } else if(message.body.includes("harga")) {
        const chat = await message.getChat('');
		chat.sendStateTyping();	
       } else if(message.body.includes("Dimana")) {
        const chat = await message.getChat('');
		chat.sendStateTyping();	
       } else if(message.body.includes("mana")) {
        const chat = await message.getChat('');
		chat.sendStateTyping();		
       } else if(message.body.includes("dimana")) {
        const chat = await message.getChat('');
		chat.sendStateTyping();	
		
		} else if (message.body === 'p') {
        const chat = await message.getChat('');
		chat.clearState();
		} else if (message.body === 'P') {
        const chat = await message.getChat('');
		chat.clearState();
		} else if (message.body === 'halo') {
        const chat = await message.getChat('');
		chat.clearState();
	}
	});
	// simulates typing in the chat

//end of pesan//

server.listen(port, function() {
	console.log('App running on *:' + port);
});