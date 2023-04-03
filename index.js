require('dotenv').config({ path: '.config/.env' });

const { setupBot } = require('./bot.js');
const fs = require('fs');

(async function () {
   try {

      await setupBot().launch();

   } catch (error) {
      console.log('Ошибка запуска', error);
   }
})()
