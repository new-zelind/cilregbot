import {
  MessageActionRow,
  Modal,
  ModalActionRowComponent,
  TextInputComponent,
} from "discord.js";
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
    //await interaction.deferReply();

    const modal = new Modal()
      .setCustomId("registrationModal")
      .setTitle("CiL Driver Application");

    const nameInput = new TextInputComponent()
      .setCustomId("displayNameInput")
      .setLabel("Name (First & Last):")
      .setStyle("SHORT")
      .setRequired(true);
    const nameActionRow =
      new MessageActionRow<ModalActionRowComponent>().addComponents(nameInput);

    const iracingNameInput = new TextInputComponent()
      .setCustomId("iracingNameInput")
      .setLabel("Your name exactly as it appears in iRacing:")
      .setStyle("SHORT")
      .setRequired(true);
    const irNameActionRow =
      new MessageActionRow<ModalActionRowComponent>().addComponents(
        iracingNameInput
      );

    const iracingIdInput = new TextInputComponent()
      .setCustomId("iracingIdInput")
      .setLabel("iRacing Customer ID:")
      .setStyle("SHORT");
    const idActionRow =
      new MessageActionRow<ModalActionRowComponent>().addComponents(
        iracingIdInput
      );

    const schoolInput = new TextInputComponent()
      .setCustomId("schoolInput")
      .setLabel("Full School Name:")
      .setStyle("SHORT");
    const schoolActionRow =
      new MessageActionRow<ModalActionRowComponent>().addComponents(
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
