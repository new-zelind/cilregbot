import { EmbedBuilder } from "@discordjs/builders";
import { GetAPIVoiceRegionsResult } from "discord-api-types/v9";
import { Interaction, MessageEmbed } from "discord.js";

function toCode(text: string): string {
  return `\`\`\`${text}\`\`\``;
}

function toInline(text: string): string {
  return `\`${text}\``;
}

function escape(text: string): string {
  return (text + "").replace(/[\\"']/g, "\\$&").replace(/\u0000/g, "\\0");
}

function makeEmbed(interaction?: Interaction) {}

module.exports = {
  toCode,
  toInline,
  escape,
  makeEmbed,
};
