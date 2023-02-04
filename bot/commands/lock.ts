import { Role, RoleManager, TextChannel } from "discord.js";
import Command, { Permissions } from "lib/command";

const LockCommand = Command({
  names: ["lock"],

  documentation: {
    description: "Locks a channel.",
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

    // get student and alumni roles
    const alumniRole = (interaction.guild?.roles as RoleManager).cache.find(
      (r) => r.name === "Alumni"
    ) as Role;
    const studentRole = (interaction.guild?.roles as RoleManager).cache.find(
      (r) => r.name === "Student"
    ) as Role;

    // lock channel
    channel.permissionOverwrites.create(alumniRole, {
      SEND_MESSAGES: false,
      VIEW_CHANNEL: null,
    });
    channel.permissionOverwrites.create(studentRole, {
      SEND_MESSAGES: false,
      VIEW_CHANNEL: null,
    });

    return await interaction.reply("Channel locked.");
  },
});

export default LockCommand;
