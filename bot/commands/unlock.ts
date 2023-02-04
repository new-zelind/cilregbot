import { TextChannel } from "discord.js";
import Command, { Permissions } from "lib/command";

const UnlockCommand = Command({
  names: ["unlock"],

  documentation: {
    description: "Unlocks a channel.",
  },

  check: Permissions.staff(),

  async fail(interaction) {
    return await interaction.reply({
      content: "You are not authorized to perform this action.",
      ephemeral: true,
    });
  },

  async exec(interaction) {
    const channel = interaction.channel as TextChannel;
    channel.lockPermissions();
    return await interaction.reply("Channel unlocked.");
  },
});

export default UnlockCommand;
