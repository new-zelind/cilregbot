import { EmbedBuilder } from "@discordjs/builders";
import {
  Channel,
  Emoji,
  Guild,
  GuildAuditLogsEntry,
  GuildBan,
  GuildMember,
  Message,
  PartialGuildMember,
  PartialMessage,
  Role,
  TextChannel,
  User,
} from "discord.js";
import { toCode } from "../lib/utils";
import { client } from "../client";

export async function handleBanAdd(ban: GuildBan): Promise<Message | boolean> {
  const adminLog = ban.guild.channels.cache.find(
    (c) => c.name === "event-log"
  ) as TextChannel;

  if (!adminLog) return false;

  const entry = (await ban.guild
    .fetchAuditLogs({ type: "MEMBER_BAN_ADD" })
    .then((log) => log.entries.first())) as GuildAuditLogsEntry;

  if (!entry || entry.executor?.bot) return false;

  let timestamp: Date = new Date();

  const embed: EmbedBuilder = new EmbedBuilder()
    .setColor(0xc8102e)
    .setTitle("NEW BAN ADDED")
    .setDescription("Member banned from server")
    .setImage(ban.user.avatarURL())
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

  return await adminLog.send({ embeds: [embed.data] });
}

export async function handleBanRemove(
  ban: GuildBan
): Promise<Message | boolean> {
  const adminLog = ban.guild.channels.cache.find(
    (c) => c.name === "event-log"
  ) as TextChannel;
  if (!adminLog) return false;

  const entry = (await ban.guild
    .fetchAuditLogs({ type: "MEMBER_BAN_REMOVE" })
    .then((log) => log.entries.first())) as GuildAuditLogsEntry;

  if (!entry || entry.executor?.bot) return false;

  let timestamp: Date = new Date();

  const embed: EmbedBuilder = new EmbedBuilder()
    .setColor(0x00b2a9)
    .setTitle("BAN REMOVED")
    .setDescription("Server ban revoked")
    .setImage(ban.user.avatarURL())
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

  return await adminLog.send({ embeds: [embed.data] });
}

export async function handleLeave(
  member: GuildMember | PartialGuildMember
): Promise<Message | boolean> {
  const adminLog = member.guild.channels.cache.find(
    (c) => c.name === "event-log"
  ) as TextChannel;
  if (!adminLog) return false;

  let timestamp: Date = new Date();

  const embed: EmbedBuilder = new EmbedBuilder()
    .setColor(0xf6eb61)
    .setTitle("MEMBER LEAVE")
    .setDescription("Member kicked or left server voluntarily")
    .setImage(member.user.avatarURL())
    .addFields(
      { name: "User ID", value: member.user.id },
      { name: "Username", value: member.user.username, inline: true },
      { name: "#", value: member.user.discriminator, inline: true },
      { name: "Timestamp", value: timestamp.toLocaleTimeString() }
    );

  return await adminLog.send({ embeds: [embed.data] });
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
    }] in ${old.channel.toString()}: ${old.content.toString()} => ${current.content.toString()}`
  );

  const author: User = old.author;
  const timestamp: Date = new Date();

  const adminLog = old.guild?.channels.cache.find(
    (channel) => channel.name === "event-log"
  ) as TextChannel;
  if (!adminLog) return false;

  const embed: EmbedBuilder = new EmbedBuilder()
    .setColor(0x3c1361)
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
      { name: "Old Text:", value: "Text: " + old.content },
      { name: "New Text:", value: "Text: " + current.content },
      { name: "Link", value: current.url }
    );

  return await adminLog.send({ embeds: [embed.data] });
}

export async function handleMessageDelete(
  message: Message | PartialMessage
): Promise<Message | boolean> {
  const adminLog = message.guild?.channels.cache.find(
    (channel) => channel.name === "event-log"
  ) as TextChannel;
  if (!adminLog) return false;

  const author: GuildMember = message.member as GuildMember;
  const timestamp: Date = new Date();

  if (author.id === client.user?.id) return false;

  const embed: EmbedBuilder = new EmbedBuilder()
    .setColor(0x034694)
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
      { name: "Message Text:", value: "Text: " + message.content },
      { name: "Link (in case of TOS violation)", value: message.url }
    );

  adminLog.send({ embeds: [embed.data] });

  if (message.attachments.size > 0) {
    adminLog.send("ATTACHMENTS:");

    message.attachments.forEach((attachment) => {
      let url: string = attachment.url;
      adminLog.send(url);
    });
  }

  return true;
}

function matchAll(str: string, re: RegExp) {
  return (str.match(re) || [])
    .map((i) => RegExp(re.source, re.flags).exec(i))
    .filter((j) => j !== null);
}

async function cleanup(message: Message): Promise<string> {
  let content: string = message.content;

  // clean up the bullshit in role mentions
  const roles: {
    key: string;
    role: Role | undefined;
  }[] = await Promise.all(
    matchAll(content, /<@#&([0-9]+)>/g).map(async (match) => ({
      key: (match as RegExpExecArray)[0],
      role: (message.guild as Guild).roles.cache.get(
        (match as RegExpExecArray)[1]
      ),
    }))
  );

  //clean up the bullshit in member mentions
  const members: {
    key: string;
    member: GuildMember | undefined;
  }[] = await Promise.all(
    matchAll(content, /<@#&([0-9]+)>/g).map(async (match) => ({
      key: (match as RegExpExecArray)[0],
      member: (message.guild as Guild).members.cache.get(
        (match as RegExpExecArray)[1]
      ),
    }))
  );

  //clean up the bullshit in channel mentions
  const channels: {
    key: string;
    channel: Channel | undefined;
  }[] = await Promise.all(
    matchAll(content, /<@#&([0-9]+)>/g).map(async (match) => ({
      key: (match as RegExpExecArray)[0],
      channel: (message.guild as Guild).channels.cache.get(
        (match as RegExpExecArray)[1]
      ),
    }))
  );

  //clean up the bullshit in emojis
  const emoji: {
    key: string;
    emoji: Emoji | undefined;
  }[] = await Promise.all(
    matchAll(content, /<@#&([0-9]+)>/g).map(async (match) => ({
      key: (match as RegExpExecArray)[0],
      emoji: (message.guild as Guild).emojis.cache.get(
        (match as RegExpExecArray)[1]
      ),
    }))
  );

  roles.forEach(
    ({ key, role }) => (content = content.replace(key, `@[${role?.name}]`))
  );

  members.forEach(
    ({ key, member }) =>
      (content = content.replace(key, `@[${member?.nickname}]`))
  );
  emoji.forEach(
    ({ key, emoji }) => (content = content.replace(key, `\:[${emoji?.name}]:`))
  );
  channels.forEach(
    ({ key, channel }) =>
      (content = content.replace(key, `#[${channel?.toString()}]`))
  );

  return content;
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

  let fullContent: string = await cleanup(message);
  let msgList: string[] = await splitMessagesLogically(fullContent);
  let toSend: string = "";
  toSend += `[${message.author.username}#${message.author.discriminator}]`;
  toSend += ` in ${message.channel.name} at `;
  toSend += `${message.createdAt.toLocaleString()}`;
  serverLog.send(toSend);

  msgList.forEach((str: string) => serverLog.send(toCode(str)));

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
