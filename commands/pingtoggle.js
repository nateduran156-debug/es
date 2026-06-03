import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { vanityGroups } from "../config.js";
import { setPingEnabled, getAllPingSettings } from "../pingSettings.js";

const groupChoices = Object.keys(vanityGroups).map((g) => ({ name: g, value: g }));

export const data = new SlashCommandBuilder()
  .setName("pingtoggle")
  .setDescription("Turn @everyone pings on or off for a specific vanity group.")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
  .addSubcommand((sub) =>
    sub
      .setName("set")
      .setDescription("Enable or disable pings for a vanity group.")
      .addStringOption((option) =>
        option
          .setName("group")
          .setDescription("The vanity group to configure.")
          .setRequired(true)
          .addChoices(...groupChoices)
      )
      .addBooleanOption((option) =>
        option
          .setName("enabled")
          .setDescription("true = pings on, false = pings off")
          .setRequired(true)
      )
  )
  .addSubcommand((sub) =>
    sub
      .setName("status")
      .setDescription("View the current ping settings for all vanity groups.")
  );

export async function execute(interaction) {
  const sub = interaction.options.getSubcommand();

  if (sub === "status") {
    const settings = getAllPingSettings();
    const lines = Object.entries(settings).map(
      ([group, enabled]) => `${group} — pings ${enabled ? "ON" : "OFF"}`
    );

    return interaction.editReply({
      content: `**Ping Settings**\n\n${lines.join("\n")}`,
    });
  }

  if (sub === "set") {
    const group = interaction.options.getString("group");
    const enabled = interaction.options.getBoolean("enabled");

    setPingEnabled(group, enabled);

    return interaction.editReply({
      content: `Pings for ${group} are now ${enabled ? "ON" : "OFF"}.`,
    });
  }
}
