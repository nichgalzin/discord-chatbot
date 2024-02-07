const { SlashCommandBuilder } = require('discord.js');
const OpenAi = require('openai');
const dotenv = require('dotenv');

dotenv.config();

const OPEN_AI_TOKEN = process.env.OPEN_AI_TOKEN;
const openaiClient = new OpenAi({ apiKey: OPEN_AI_TOKEN });

module.exports = {
  data: new SlashCommandBuilder()
    .setName('joke')
    .setDescription('What do you want a joke about?')
    .addStringOption((option) =>
      option.setName('input').setDescription('Joke topic')
    ),
  async execute(interaction) {
    await interaction.deferReply();

    const userInput = interaction.options.getString('input');

    const completion = await openaiClient.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a snarky comic.' },
        {
          role: 'user',
          content: `Tell me your favourite joke about ${userInput} !`,
        },
      ],
      model: 'gpt-3.5-turbo',
    });
    await interaction.editReply(completion.choices[0].message.content);
  },
};
