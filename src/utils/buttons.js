const { Markup } = require("telegraf");

const menuKeyboard = Markup.keyboard([
   ['Войти в диалог'],
   ['Очистить диалог']
]).resize();

module.exports = {
   menuKeyboard
}