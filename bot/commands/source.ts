import Command, { Permissions } from "~lib/command";
import { owner } from "~secret/discord.json";

const SourceCommand = Command({
  names: ["source"],

  documentation: {
    description: "Get the link to the bot's source repository.",
  },

  check: Permissions.channel(owner),

  async fail(interaction) {
    return await interaction.reply({
      content: "In the bots channel, please!",
      ephemeral: true,
    });
  },

  async exec(interaction) {
    return await interaction.reply({
      content: "Here's my source code: https://github.com/new-zelind/cilregbot",
      ephemeral: true,
    });
  },
});

export default SourceCommand;
