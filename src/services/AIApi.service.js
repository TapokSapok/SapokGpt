const { Configuration, OpenAIApi } = require('openai')
const fs = require('fs')

const getUsers = async () => {
   const jsonData = fs.promises.readFile('./src/internal/users.json', 'utf-8');
   return await jsonData.then(data => { return JSON.parse(data) });
}

const getApi = async (userId) => {
   const jsonData = fs.promises.readFile('./src/internal/api.json', 'utf-8');
   const apis = await jsonData.then(data => { return JSON.parse(data) });
   for (let i = 0; i < apis.length; i++) {
      if (apis[i].who === userId) return 'User allowed'
      if (apis[i].busy) {
         apis[i].busy = false;
         apis[i].who = userId;
         fs.promises.writeFile('./src/internal/api.json', JSON.stringify(apis));
         return apis[i].api;
      };
   };
   return apis[0].api;
};

const giveApi = async (api, userId) => {
   const jsonData = fs.promises.readFile('./src/internal/api.json', 'utf-8');
   const apis = await jsonData.then(data => { return JSON.parse(data) });
   for (let i = 0; i < apis.length; i++) {
      if (apis[i].api === api) {
         apis[i].busy = true;
         apis[i].who = false;
         fs.promises.writeFile('./src/internal/api.json', JSON.stringify(apis));
      }
      if (api === 'error' && apis[i].who === userId) {
         apis[i].busy = true;
         apis[i].who = false;
         fs.promises.writeFile('./src/internal/api.json', JSON.stringify(apis));
      }
   };
};

const giveUsers = async () => {

};

const request = async (text, userId) => {
   try {
      const api = await getApi(userId);
      if (api === 'User allowed') return 'Вы уже отправили сообщение, ожидайте ответа.';

      const openai = new OpenAIApi(new Configuration({
         organization: 'org-H043MEreMj8Z5YgAKD74S0H9',
         apiKey: api,
      }));


      let users = await getUsers();
      const user = users.find(user => user.id === userId);

      user.messages.push({ 'role': 'user', 'content': text });
      const res = await openai.createChatCompletion({
         model: 'gpt-3.5-turbo',
         messages: user.messages,
         temperature: 1
      });
      user.messages.push({ 'role': 'assistant', 'content': res.data.choices[0].message.content });

      await giveApi(api, userId);

      await users.map(obj => obj.id === user.id ? obj = user : null);
      await fs.promises.writeFile('./src/internal/users.json', JSON.stringify(users));

      return res.data.choices[0].message.content;

   } catch (e) {
      await giveApi('error', userId)
      if (e.response) {
         console.log(e.response.data)

         if (e.response.data.error.code === 'context_length_exceeded') {
            return 'У вас слишком длинный диалог, очистите его что-бы продолжить общение.'
         } else {
            return e.response.data.error.message
         }

      } else {
         console.log('Ошибка не в апи')
         return 'Проблема с ботом, разраб даун'
      }
   }
}

module.exports = { request }