import {
  COMMANDS,
  deployApplicationCommands,
  deployGuildCommands,
  handleCommand,
} from "~lib/command";
import {
  handleBanAdd,
  handleBanRemove,
  handleLeave,
  handleMessage,
  handleMessageDelete,
  handleMessageUpdate,
} from "services/events";
import {
  GuildBan,
  GuildMember,
  Message,
  MessageReaction,
  PartialGuildMember,
  PartialMessage,
  PartialMessageReaction,
  PartialUser,
  User,
} from "discord.js";
import { developmentGuild } from "~secret/discord.json";
import { client } from "./client";
import log from "./lib/log";

// Register all of the commands
import "./commands";
import report from "~lib/report";

const statuses: string[] = [
  "Drew throw",
  "IMSA highlights",
  "sBindler sBin",
  "the latest stream VOD",
  "NASCAR crash videos",
  "Clembot",
  "for Millerin Ls",
  "over the server",
  "the guys at iRacing HQ",
  "you",
  "F1 TV",
  "for the ghost of Santi",
  "<NETCODE>",
  "over the server",
  "for cheese",
  "Caylor win... again",
  "my GPA implode",
  "Cody Ware highlights",
  "short track racin'",
  "and waiting",
];

// startup code
client.on("ready", () => {
  log(
    "info",
    `${client.user?.username}#${client.user?.discriminator} is ready!`
  );

  if (process.env.NODE_ENV === "development") {
    log("info", `deploying ${COMMANDS.size} commands to development guild...`);
    deployGuildCommands(developmentGuild);
  } else {
    log("info", `deploying ${COMMANDS.size} commands to GLOBAL list...`);
    deployApplicationCommands();
  }

  // reset statuses every 5 minutes
  setInterval(() => {
    const index: number = Math.floor(Math.random() * (statuses.length - 1));
    client.user?.setActivity(statuses[index], { type: "WATCHING" });
  }, 300000);
});

// command handlers
client.on("interactionCreate", handleCommand);

// message logging
client.on("messageCreate", (message: Message) => {
  console.log("message create");
  handleMessage(message);
});

// audit log watchdogs
client.on("guildMemberAdd", (member: GuildMember) => {
  console.log("guild member add");
});
client.on("guildMemberRemove", (member: GuildMember | PartialGuildMember) => {
  console.log("guild member remove");
  handleLeave(member);
});
client.on("guildBanAdd", (ban: GuildBan) => {
  console.log("guild ban add");
  handleBanAdd(ban);
});
client.on("guildBanRemove", (ban: GuildBan) => {
  console.log("guild ban remove");
  handleBanRemove(ban);
});
client.on("messageDelete", (message: Message | PartialMessage) => {
  console.log("message delete");
  handleMessageDelete(message);
});
client.on(
  "messageUpdate",
  async (old: Message | PartialMessage, current: Message | PartialMessage) => {
    console.log("message update");
    handleMessageUpdate(old, current);
  }
);

// starboard
client.on(
  "messageReactionAdd",
  (
    reaction: MessageReaction | PartialMessageReaction,
    user: User | PartialUser
  ) => {}
);
client.on(
  "messageReactionRemove",
  (
    reaction: MessageReaction | PartialMessageReaction,
    user: User | PartialUser
  ) => {}
);

// error reporting
const reporter = report(client);
process.on("uncaughtException", (error: Error) => reporter(error));
process.on("unhandledRejection", (error: Error) => reporter(error));
