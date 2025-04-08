const https = require('https');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

// SSL 인증서 파일 경로
const options = {
  key: fs.readFileSync('./localhost-key.pem'),
  cert: fs.readFileSync('./localhost.pem'),
};

// 익스프레스 앱 설정
const app = express();
app.use(bodyParser.json());

// 텔레그램 봇 설정
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;

// 로그 저장용 메모리
let logs = [];

// 게임 결과 API
app.post('/game/result', (req, res) => {
  const { user, result, amount } = req.body;

  const message = `
[게임 결과]
유저: ${user}
결과: ${result}
포인트: ${amount.toLocaleString()}P
  `;

  logs.push({ user, result, amount, time: new Date() });

  // 텔레그램 메시지 전송
  bot.sendMessage(ADMIN_CHAT_ID, message);

  res.json({ status: 'success', message: '전송 완료' });
});

// 로그 확인 API
app.get('/logs', (req, res) => {
  res.json({ logs });
});

// 서버 실행
https.createServer(options, app).listen(3001, () => {
  console.log('HTTPS 서버 실행: https://localhost:3001');
});