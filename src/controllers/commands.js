const { menuKeyboard } = require("../utils/buttons");
const fs = require('fs')
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
   ctx.reply('Ты находишься в меню\nВыбери действие.', { ...menuKeyboard });
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

module.exports = {
   start,
   middleware,
   backToMenu,
   clearDialog
}