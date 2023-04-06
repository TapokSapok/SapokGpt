const { Markup } = require("telegraf");

const menuKeyboard = Markup.keyboard([
   ['Войти в диалог'],
   ['Очистить диалог', 'Как составить запрос']
]).resize();

const menuInlineKeyboard = Markup.inlineKeyboard([
   Markup.button.callback('Войти в диалог', 'd-join'),
   Markup.button.callback('Очистить диалог', 'd-clear'),
   Markup.button.callback('Как составить запрос', 'd-guide')
])

module.exports = {
   menuKeyboard,
   menuInlineKeyboard
}