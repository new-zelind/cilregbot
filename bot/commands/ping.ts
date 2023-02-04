import Command, { Permissions } from "lib/command";

const PingCommand = Command({
  names: ["ping"],

  documentation: {
    description: "Pong!",
  },

  check: Permissions.always,

  async exec(interaction) {
    return await interaction.reply("Pong!");
  },
});

export default PingCommand;
