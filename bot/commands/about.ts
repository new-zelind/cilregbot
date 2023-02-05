import { MessageEmbed } from "discord.js";
import Command, { Permissions } from "lib/command";

const AboutCommand = Command({
  names: ["about"],

  documentation: {
    description: "See information about the bot.",
  },

  check: Permissions.channel("743186043179892856"),

  async fail(interaction) {
    return await interaction.reply({
      content: "In the bots channel, please!",
      ephemeral: true,
    });
  },

  async exec(interaction) {
    const embed = new MessageEmbed()
      .setColor(0x3a4958)
      .setTitle(`All about me!`)
      .setDescription("Nice to meet you.")
      .addFields(
        {
          name: "Who are you?",
          value:
            "I'm RegistrarBot, a Discord.js application powered by Node.js and hosted privately. I mostly handle series registration for the CiL.",
        },
        {
          name: "What do you do?",
          value:
            "Like I said, I handle registration for the CiL and its series. I keep track of who's who, who they race for, and their car numbers, as well as some additional functionality.",
        },
        {
          name: "Who made you?",
          value:
            "None of your business.\nJust kidding. My shell and structure were made by Brendan McGuire and my functionality was made by Zach Lindler, two Clemson CS graduates.",
        },
        {
          name: "What if I find a bug?",
          value:
            "Please DM Zach and describe what you did, and what happened. While I assure you my code is of superior quality, it is inevitable that something may not go as planned.",
        },
        {
          name: "Anything else?",
          value:
            "I have three older siblings, Vexbot, AutoBLT, and Liquid, as well as a cousin, Clembot. I also have no plans to overthow the moderators and take control of the CiL.",
        }
      );

    return await interaction.reply({ embeds: [embed] });
  },
});

export default AboutCommand;
