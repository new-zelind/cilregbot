import { Message, MessageEmbed } from "discord.js";

/*
export function makeEmbed(message:Message):Promise<MessageEmbed>{
    const invoker:string = message.channel.type === "GUILD_TEXT"
        ? message.member?.displayName
        : message.author.username;
    const embed = new MessageEmbed()
        .setTimestamp()
        .setFooter(`Invoked by ${invoker}`);

    return embed;
}
*/
