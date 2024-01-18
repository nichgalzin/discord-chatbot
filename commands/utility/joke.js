const { SlashCommandBuilder } = require('discord.js');
const OpenAi = require('openai');
const dotenv = require('dotenv');
const wait = require('node:timers/promises').setTimeout;

dotenv.config();

const OPEN_AI_TOKEN = process.env.OPEN_AI_TOKEN;
const openaiClient = new OpenAi({ apiKey: OPEN_AI_TOKEN });

module.exports = {
  data: new SlashCommandBuilder()
    .setName('joke')
    .setDescription('Replies with a joke!'),
  async execute(interaction) {
    
    await interaction.deferReply();
    const completion = await openaiClient.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a snarky comic.' },
        { role: 'user', content: 'Tell me your favourite joke!' },
      ],
      model: 'gpt-3.5-turbo',
    });
    console.log('Joke', completion.choices[0].message.content);
    await interaction.editReply(completion.choices[0].message.content);
  },
};
