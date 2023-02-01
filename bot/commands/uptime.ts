import Command, { Permissions } from "~lib/command";

const UptimeCommand = Command({
  names: ["uptime"],

  documentation: {
    description: "Checks bot uptime.",
  },

  check: Permissions.user("286283133337206784"),

  async fail(interaction) {
    return await interaction.reply({
      content: "Wait, you're not Zach.",
      ephemeral: true,
    });
  },

  async exec(interaction) {
    if (!interaction.client.uptime || !interaction.client.user) return;

    let uptime: number = interaction.client.uptime / 1000;
    let d: number = Math.floor(uptime / 86400);
    let h: number = Math.floor(uptime / 3600);
    uptime %= 3600;
    let m: number = Math.floor(uptime / 60);
    let s: number = uptime % 60;

    return await interaction.reply({
      content: `**${
        interaction.client.user.tag
      } UPTIME**\n_${d}_ DAYS, _${h}_ HOURS, _${m}_ MINUTES, _${s.toFixed(
        3
      )}_ SECONDS`,
      ephemeral: true,
    });
  },
});

export default UptimeCommand;
