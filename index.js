const TelegramBot = require('node-telegram-bot-api');
const { gameOptions, againOptions } = require('./options');
const sequelize = require('./db');
const token = "7188092819:AAE4xRCYb-hHgOoNsT8g_1nyyic08msSLh4";
const bot = new TelegramBot(token, { polling: true });

const chats = {};


const startGame = async (chatId) => {
  await bot.sendMessage(chatId, 'Guess the number from 0 to 9');
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, 'Enter your number: ', gameOptions);
}

const startBot = async () => {

  try {
    await sequelize.authenticate();
    await sequelize.sync();
  } catch (error) {
    console.log("Connect to database was with error: " + error);
  }

  bot.setMyCommands([
    { command: '/start', description: 'Start working with a bot' },
    { command: '/info', description: 'Get information about yourself' },
    { command: '/game', description: 'Guess the number from 0 to 9' }
  ]);

  bot.on('message', async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === '/start') {
      await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/8a1/9aa/8a19aab4-98c0-37cb-a3d4-491cb94d7e12/192/21.webp');
      return bot.sendMessage(chatId, 'Hello! You can start working with a bot.');
    }

    if (text === '/info') {
      return bot.sendMessage(chatId, 'Your name: ' + msg.from.first_name + " " + msg.from.last_name + '\n' + 'Your username: ' + msg.from.username);
    }

    if (text === '/game') {
      return startGame(chatId);
    }

    return bot.sendMessage(chatId, 'I don\'t understand that command.');
  });

  bot.on('callback_query', async query => {
    const chatId = query.message.chat.id;
    const data = query.data;

    if (data === '/again') {
      return startGame(chatId);
    }

    if (data === chats[chatId]) {
      return await bot.sendMessage(chatId, 'You guessed it correctly!', againOptions);
    } else {
      return await bot.sendMessage(chatId, 'You guessed it incorrectly! The bot made a figure: ' + chats[chatId], againOptions);
    }
  });
}

startBot();
