const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const OpenAi = require('openai');
const dotenv = require('dotenv');
const fs = require('node:fs');
const path = require('node:path');

dotenv.config();
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
  ],
});

client.login(DISCORD_TOKEN);
client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith('.js'));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith('.js'));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}




// const OPEN_AI_TOKEN = process.env.OPEN_AI_TOKEN;
// const openai = new OpenAi({ apiKey: OPEN_AI_TOKEN });

// const conversationHistory = [
//   { role: 'system', content: 'You are a helpful assistant.' },
// ];

// const getOpenAiResponse = async () => {
//   try {
//     const completion = await openai.chat.completions.create({
//       model: 'gpt-3.5-turbo',
//       messages: conversationHistory,
//     });

//     updateConversationHistory({
//       role: 'assistant',
//       content: completion.choices[0].message.content,
//     });

//     return completion.choices[0].message.content;
//   } catch (error) {
//     console.log(error);
//     return null;
//   }
// };

// const updateConversationHistory = (newMessage) => {
//   conversationHistory.push(newMessage);
//   if (conversationHistory.length > 10) {
//     conversationHistory.shift();
//   }
// };

// client.on('messageCreate', async (message) => {
//   if (message.author.bot) return;

//   const userMessage = { role: 'user', content: message.content };
//   updateConversationHistory(userMessage);
//   const response = await getOpenAiResponse();

//   console.log(conversationHistory);

//   if (response) {
//     await message.reply(response);
//   } else {
//     console.error('Failed to get a response from OpenAI.');
//     await message.reply("I'm sorry, I couldn't process your request.");
//   }
// });
