const { SlashCommandBuilder } = require('discord.js');
const OpenAi = require('openai');
const dotenv = require('dotenv');

dotenv.config();

const OPEN_AI_TOKEN = process.env.OPEN_AI_TOKEN;
const openai = new OpenAi({ apiKey: OPEN_AI_TOKEN });

const conversationHistory = [
  { role: 'system', content: 'You are a helpful assistant.' },
];

const getOpenAiResponse = async () => {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: conversationHistory,
    });

    updateConversationHistory({
      role: 'assistant',
      content: completion.choices[0].message.content,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const updateConversationHistory = (newMessage) => {
  conversationHistory.push(newMessage);
  if (conversationHistory.length > 10) {
    conversationHistory.shift();
  }
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ask')
    .setDescription('Ask me anything!')
    .addStringOption((option) =>
      option.setName('input').setDescription('Query')
    ),
  async execute(interaction) {
    await interaction.deferReply();

    const userInput = interaction.options.getString('input');
    const userMessage = { role: 'user', content: userInput };
    updateConversationHistory(userMessage);

    const response = await getOpenAiResponse();
    await interaction.editReply(response);
  },
};
