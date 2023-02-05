import {
  Channel,
  Emoji,
  Guild,
  GuildAuditLogsEntry,
  GuildBan,
  GuildMember,
  Message,
  MessageEmbed,
  PartialGuildMember,
  PartialMessage,
  Role,
  TextChannel,
  User,
} from "discord.js";
import { client } from "client";

export async function handleBanAdd(ban: GuildBan): Promise<Message | boolean> {
  const adminLog = ban.guild.channels.cache.find(
    (c) => c.name === "admin-log"
  ) as TextChannel;

  if (!adminLog) return false;

  const entry = (await ban.guild
    .fetchAuditLogs({ type: "MEMBER_BAN_ADD" })
    .then((log) => log.entries.first())) as GuildAuditLogsEntry;

  if (!entry || entry.executor?.bot) return false;

  let timestamp: Date = new Date();

  const embed: MessageEmbed = new MessageEmbed()
    .setColor(0xd22730)
    .setTitle("NEW BAN ADDED")
    .setDescription("Member banned from server")
    .setImage(ban.user.avatarURL() || "")
    .addFields(
      { name: "User ID", value: ban.user.id },
      { name: "Username", value: ban.user.username, inline: true },
      { name: "#", value: ban.user.discriminator, inline: true },
      { name: "Timestamp", value: timestamp.toLocaleTimeString() },
      {
        name: "Executor",
        value: `${entry.executor?.username}#${entry.executor?.discriminator}`,
      },
      {
        name: "Reason",
        value: `${entry.reason}`,
      }
    );

  return await adminLog.send({ embeds: [embed] });
}

export async function handleBanRemove(
  ban: GuildBan
): Promise<Message | boolean> {
  const adminLog = ban.guild.channels.cache.find(
    (c) => c.name === "admin-log"
  ) as TextChannel;
  if (!adminLog) return false;

  const entry = (await ban.guild
    .fetchAuditLogs({ type: "MEMBER_BAN_REMOVE" })
    .then((log) => log.entries.first())) as GuildAuditLogsEntry;

  if (!entry || entry.executor?.bot) return false;

  let timestamp: Date = new Date();

  const embed: MessageEmbed = new MessageEmbed()
    .setColor(0x44d62c)
    .setTitle("BAN REMOVED")
    .setDescription("Server ban revoked")
    .setImage(ban.user.avatarURL() || "")
    .addFields(
      { name: "User ID", value: ban.user.id },
      { name: "Username", value: ban.user.username, inline: true },
      { name: "#", value: ban.user.discriminator, inline: true },
      { name: "Timestamp", value: timestamp.toLocaleTimeString() },
      {
        name: "Executor",
        value: `${entry.executor?.username}#${entry.executor?.discriminator}`,
      }
    );

  return await adminLog.send({ embeds: [embed] });
}

export async function handleLeave(
  member: GuildMember | PartialGuildMember
): Promise<Message | boolean> {
  const adminLog = member.guild.channels.cache.find(
    (c) => c.name === "admin-log"
  ) as TextChannel;
  if (!adminLog) return false;

  let timestamp: Date = new Date();

  const embed: MessageEmbed = new MessageEmbed()
    .setColor(0xe0e722)
    .setTitle("MEMBER LEAVE")
    .setDescription("Member kicked or left server voluntarily")
    .setImage(member.user.avatarURL() || "")
    .addFields(
      { name: "User ID", value: member.user.id },
      { name: "Username", value: member.user.username, inline: true },
      { name: "#", value: member.user.discriminator, inline: true },
      { name: "Timestamp", value: timestamp.toLocaleTimeString() }
    );

  return await adminLog.send({ embeds: [embed] });
}

export async function handleMessageUpdate(
  old: PartialMessage | Message,
  current: PartialMessage | Message
): Promise<Message | boolean> {
  //get old and new attributes and content
  if (old.partial) old = await old.fetch();
  if (current.partial) current = await current.fetch();
  if (old.author.bot) return false;
  if (old.channel.type === "DM") return false;

  //find and validate the server log channel
  const serverLog = old.guild?.channels.cache.find(
    (channel) => channel.name === "server-log"
  ) as TextChannel;
  if (!serverLog) return false;

  //send the updated message
  serverLog.send(
    `[${old.author.username}#${
      old.author.discriminator
    }] in ${old.channel.toString()}: \`\`\`${old.content.toString()}\`\`\` => \`\`\`${current.content.toString()}\`\`\``
  );

  const author: User = old.author;
  const timestamp: Date = new Date();

  const adminLog = old.guild?.channels.cache.find(
    (channel) => channel.name === "admin-log"
  ) as TextChannel;
  if (!adminLog) return false;

  const embed: MessageEmbed = new MessageEmbed()
    .setColor(0xc724b1)
    .setTitle("MESSAGE EDITED")
    .addFields(
      { name: "Username", value: author.username, inline: true },
      {
        name: "#",
        value: author.discriminator,
        inline: true,
      },
      {
        name: "Timestamp",
        value: timestamp.toLocaleTimeString(),
        inline: true,
      },
      { name: "In Channel", value: old.channel.name, inline: true },
      { name: "Old Text:", value: `${old.cleanContent}` },
      { name: "New Text:", value: `${current.cleanContent}` },
      { name: "Link", value: current.url }
    );

  return await adminLog.send({ embeds: [embed] });
}

export async function handleMessageDelete(
  message: Message | PartialMessage
): Promise<Message | boolean> {
  const adminLog = message.guild?.channels.cache.find(
    (channel) => channel.name === "admin-log"
  ) as TextChannel;
  if (!adminLog) return false;

  const author: GuildMember = message.member as GuildMember;
  const timestamp: Date = new Date();

  if (author.id === client.user?.id) return false;

  const embed: MessageEmbed = new MessageEmbed()
    .setColor(0x4d4dff)
    .setTitle("MESSAGE DELETED")
    .addFields(
      { name: "Username", value: author.user.username, inline: true },
      {
        name: "#",
        value: author.user.discriminator,
        inline: true,
      },
      {
        name: "Timestamp",
        value: timestamp.toLocaleTimeString(),
        inline: true,
      },
      { name: "In Channel", value: (message.channel as TextChannel).name },
      { name: "Message Text:", value: `${message.cleanContent}` },
      { name: "Link (in case of TOS violation)", value: message.url }
    );

  adminLog.send({ embeds: [embed] });

  if (message.attachments.size > 0) {
    adminLog.send("ATTACHMENTS:");

    message.attachments.forEach((attachment) => {
      let url: string = attachment.url;
      adminLog.send(url);
    });
  }

  return true;
}

async function splitMessagesLogically(message: string): Promise<string[]> {
  let messages: string[] = [];
  let msgIndex: number = 0;

  for (let [index, char] of Object.entries(message)) {
    let i: number = +index;

    if (i >= 1999 || (i > 1800 && [" "].includes(char))) {
      msgIndex++;
    }

    if (!messages[msgIndex]) {
      messages[msgIndex] = "";
    }

    messages[msgIndex] += char;
  }

  return messages;
}

export async function handleMessage(
  message: Message
): Promise<Message | boolean> {
  if (message.author.bot) return false;
  if (message.channel.type === "DM") return false;

  const serverLog = message.guild?.channels.cache.find(
    (C) => C.name === "server-log"
  ) as TextChannel;
  if (!serverLog) return false;

  let msgList: string[] = await splitMessagesLogically(
    message.cleanContent.replace("`", "")
  );
  let toSend: string = "";
  toSend += `[${message.author.username}#${message.author.discriminator}]`;
  toSend += ` in \`${message.channel.name}\` at `;
  toSend += `${message.createdAt.toLocaleString()}`;
  serverLog.send(toSend);

  msgList.forEach((str: string) => serverLog.send(`\`\`\`${str}\`\`\``));

  //log attachments, if necessary
  if (message.attachments.size > 0) {
    serverLog.send("ATTACHMENTS:");
    message.attachments.forEach((a) => {
      let url: string = a.url;
      serverLog.send(url);
    });
  }

  return false;
}
