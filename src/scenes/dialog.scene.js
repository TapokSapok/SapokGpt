const { Markup, Composer, Scenes } = require('telegraf');
const { backToMenu, clearDialog, middleware } = require('../controllers/commands');
const { request } = require('../services/AIApi.service.js');
const data = async () => { return new Date().toLocaleTimeString() }

const createDialogScene = new Scenes.WizardScene('dialogScene', async (ctx) => {
   try {
      ctx.wizard.state.data = {};
      ctx.wizard.state.userName = ctx.message.from.username;
      ctx.wizard.state.firstName = ctx.message.from.first_name;
      ctx.wizard.state.lastName = ctx.message.from.last_name;
      await ctx.replyWithHTML(`
      Ты вошел в диалог!
      <i>Напиши что-нибудь</i>
      `, Markup.keyboard([
         ['Выйти в меню'],
         ['Очистить диалог']
      ]).resize());
      ctx.wizard.next();
   } catch (e) {
      console.log(e)
   }
},
   async (ctx) => {
      (async () => {
         try {
            if (typeof ctx.message.text !== 'string') { ctx.reply('На данный момент я могу обрабатывать только текстовые сообщения :('); return };
            console.log(`${await data()} | request | ${ctx.from.username ? ctx.from.username : null} | ${ctx.message.text ? ctx.message.text : null}`)

            const resMessage = await ctx.reply('⏳ Печатает..');
            await ctx.sendChatAction('typing', ctx.chat.id);

            const res = await request(ctx.message.text, ctx.from.id, 'New');
            await ctx.deleteMessage(resMessage.message_id);
            try {
               await ctx.reply(res, { reply_to_message_id: ctx.message.message_id });
            } catch (e) {
               await ctx.reply(res);
            }

            console.log(`${await data()} | response | ${ctx.from.username ? ctx.from.username : null} | ${res ? res : null}`)
         } catch (e) {
            console.log(e)
         }
      })()
   });

createDialogScene.hears('Очистить диалог', ctx => { clearDialog(ctx.message.from.id); ctx.reply('История сообщений очищена!\nОбщайся с чистого листа :3') });
createDialogScene.hears('Выйти в меню', ctx => backToMenu(ctx, 'dialogScene'));


module.exports = createDialogScene;