import Command, { Permissions } from "~lib/command";
import * as os from "os";
import { toCode } from "~lib/utils";

const MachineCommand = Command({
  names: ["machine"],

  documentation: {
    description: "Lists the machine the bot is running on.",
  },

  check: Permissions.user("286283133337206784"),

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
      content: toCode(`${username}@${machine}: ${type} ${arch}`),
      ephemeral: true,
    });
  },
});

export default MachineCommand;
