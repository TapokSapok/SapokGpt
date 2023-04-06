const { Telegraf, Scenes, Markup, session } = require('telegraf')
const { start, middleware, backToMenu, clearDialog, guide } = require('./src/controllers/commands.js');


const dialogScene = require('./src/scenes/dialog.scene.js')

const stage = new Scenes.Stage([dialogScene]);
const bot = new Telegraf('6204684389:AAHjAgezDkB6pc5ZdXLP5GmyDB2Td2n7VyE');
const setupBot = () => {

   bot.use(session())
   bot.use(stage.middleware())
   bot.use(middleware);

   bot.action('d-join', async (ctx) => { ctx.scene.enter('dialogScene') })
   bot.action('d-clear', (ctx) => { clearDialog(ctx.message.from.id); ctx.reply('История сообщений очищена!\nОбщайся с чистого листа :3') })
   bot.action('d-guide', ctx => guide(ctx))

   bot.command('start', start);
   bot.hears('Как составить запрос', ctx => guide(ctx))
   bot.hears('Выйти в меню', ctx => backToMenu(ctx, ''));
   bot.hears('Войти в диалог', ctx => ctx.scene.enter('dialogScene'));
   bot.hears('Очистить диалог', ctx => { clearDialog(ctx.message.from.id); ctx.reply('История сообщений очищена!\nОбщайся с чистого листа :3') });
   bot.on('text', ctx => backToMenu(ctx, ''))
   return bot;
}

module.exports = {
   setupBot
}
