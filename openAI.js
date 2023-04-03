const { Configuration, OpenAIApi } = require('openai')
const fetch = require('node-fetch')
const fs = require('fs')

const openai = new OpenAIApi(new Configuration({
   organization: 'org-H043MEreMj8Z5YgAKD74S0H9',
   apiKey: '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'
}));





const request = async (text, userId) => {
   // let messages = [];
   let result = 'ресулта еще нету :)'

   const messages = JSON.parse(fs.readFileSync('./internal/users.json', (err, data) => {
      data = JSON.parse(data);
      let messages = [];

      for (let i = 0; i < data.length; i++) {
         if (data[i].id === userId) {
            messages = data[i].messages
         };
      };
      return messages
   }))

   try {
      messages.push({ 'role': 'user', 'content': text });

      const res = await openai.createChatCompletion({
         model: 'gpt-3.5-turbo',
         messages: messages,
      })
      messages.push({ 'role': 'assistant', 'content': res.data.choices[0].message.content });
      console.log(res.data.choices[0].message.content)

      fs.readFileSync('./internal/users.json', (err, data) => {
         data = JSON.parse(data);

         for (let i = 0; i < data.length; i++) {
            if (data[i].id === userId) {
               data[i].messages = messages
            };
         }
      })

      fs.writeFileSync('./internal/users.json', JSON.stringify(data))

      result = res.data.choices[0].message.content
      console.log(res)
      return result
   } catch (error) {
      console.log("ERROR ")
   }
   return result


}

module.exports = request
