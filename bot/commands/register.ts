import {
  ActionRowBuilder,
  ModalActionRowComponentBuilder,
  ModalBuilder,
  TextInputBuilder,
} from "@discordjs/builders";
import { TextInputStyle } from "discord-api-types/v9";
import Command, { Permissions } from "lib/command";

const RegisterCommand = Command({
  names: ["register"],

  documentation: {
    description: "Register for the CiL!",
  },

  check: Permissions.channel("743186043179892856"),

  async fail(interaction) {
    return await interaction.reply({
      content: "In the bots channel, please!",
      ephemeral: true,
    });
  },

  async exec(interaction) {
    await interaction.deferReply();

    const modal = new ModalBuilder()
      .setCustomId("registrationModal")
      .setTitle("CiL Driver Registration");

    const nameInput = new TextInputBuilder()
      .setCustomId("displayNameInput")
      .setLabel("What is your name?")
      .setStyle(TextInputStyle.Short);
    const nameActionRow =
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        nameInput
      );

    const iracingNameInput = new TextInputBuilder()
      .setCustomId("iracingNameInput")
      .setLabel("Enter your name exactly as it appears in iRacing:")
      .setStyle(TextInputStyle.Short);
    const irNameActionRow =
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        iracingNameInput
      );

    const iracingIdInput = new TextInputBuilder()
      .setCustomId("iracingIdInput")
      .setLabel(
        "What is your iRacing customer ID? (Tip: look in the upper right corner of the iRacing Account section on the membersite)"
      )
      .setStyle(TextInputStyle.Short);
    const idActionRow =
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        iracingIdInput
      );

    const schoolInput = new TextInputBuilder()
      .setCustomId("schoolInput")
      .setLabel(
        "What school are you representing? (Full name, please, e.g. University of Texas at Arlington)"
      )
      .setStyle(TextInputStyle.Short);
    const schoolActionRow =
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        schoolInput
      );

    modal.addComponents(
      nameActionRow,
      irNameActionRow,
      idActionRow,
      schoolActionRow
    );

    await interaction.showModal(modal);
    //await interaction.followUp({content:"Registration Complete!", ephemeral:true});
  },
});

export default RegisterCommand;
