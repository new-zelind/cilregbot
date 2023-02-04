import Command, { Permissions } from "lib/command";
import * as os from "os";
import { owner } from "secret/discord.json";

const MachineCommand = Command({
  names: ["machine"],

  documentation: {
    description: "Lists the machine the bot is running on.",
  },

  check: Permissions.user(owner),

  async fail(interaction) {
    return await interaction.reply({
      content: "Wait, you're not Zach.",
      ephemeral: true,
    });
  },

  async exec(interaction) {
    const { username }: os.UserInfo<string> = os.userInfo();
    const machine: string = os.hostname();
    const type: string = os.type();
    const arch: string = os.arch();

    return await interaction.reply({
      content: `\`\`\`${username}@${machine}: ${type} ${arch}\`\`\``,
      ephemeral: true,
    });
  },
});

export default MachineCommand;
