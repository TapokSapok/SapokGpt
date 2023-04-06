const { menuKeyboard } = require("../utils/buttons");
const fs = require('fs');
const { Markup } = require("telegraf");
const data = async () => { return new Date().toLocaleTimeString() }

const start = async (ctx) => {
   await ctx.reply('Ты находишься в меню.', { ...menuKeyboard });

   const JSONdata = fs.promises.readFile('./src/internal/users.json', 'utf-8');
   const users = await JSONdata.then(data => { return JSON.parse(data) });

   for (let i = 0; i < users.length; i++) { if (users[i].id === ctx.from.id) return; }

   users.push({
      username: ctx.from.username,
      name: ctx.from.last_name ? `${ctx.from.first_name} ${ctx.from.last_name}` : `${ctx.from.first_name}`,
      id: ctx.from.id,
      chatId: ctx.chat.id,
      messages: []
   })

   fs.promises.writeFile('./src/internal/users.json', JSON.stringify(users))
}

const backToMenu = (ctx, scene) => {
   ctx.scene.leave()
   ctx.reply('Ты находишься в меню\nВыбери действие.', {
      ...menuKeyboard
   });
}

const clearDialog = async (userId, ctx) => {
   const JSONdata = fs.promises.readFile('./src/internal/users.json', 'utf-8');

   const users = await JSONdata.then(data => { return JSON.parse(data) });
   const user = users.find(user => user.id === userId);
   user.messages = [];

   users.map(obj => obj.id === user.id ? obj = user : null);
   fs.promises.writeFile('./src/internal/users.json', JSON.stringify(users))
}

const middleware = async (ctx, next) => {
   console.log(`${await data()} | menu | ${ctx.from.username} | ${ctx.message.text}`)
   return next();
}

const guide = async (ctx) => {
   await ctx.reply(`
   Здесь написаны примеры того что ты получишь при определённом запросе, и то как их стоит заполнять.

   1. Пример запроса, для получения сочинения.
      ( Напиши мне сочинение на тему "Почему важно иметь цель в жизни?" Длинной 80 слов. Напиши так, как бы написал восьмиклассник ).

   2. Пример запроса, для получения нужного предложения.
      ( Напиши 5 предложений с вводными словами со схемой ).

   3. Пример запроса, для решения задачи.
      ( Реши неравенство -3 <\= 6-x/12<2 ).

   Также не забывайте что вы с ним общаетесь как человек с человеком, и он учитывает ваши прошлые сообщения.
   Также вы можете у него спросить, как выучить ту или иную тему, и он вам даст пошаговый ответ для чайников, паралельно спрашивая то что не понимаете.
   `)
}

module.exports = {
   start,
   middleware,
   backToMenu,
   clearDialog, guide
}