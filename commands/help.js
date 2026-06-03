import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("help")
  .setDescription("Shows all available bot commands.");

export async function execute(interaction) {
  const lines = [
    "**Commands**",
    "",
    "**/role** — Assign yourself a group tag. Available tags: FaZe, Member, Fraid, Sharingan tag, Rockstar. Run the command again to remove the tag.",
    "",
    "**/pingtoggle set** — Turn @everyone pings on or off for a specific vanity group. Requires Manage Server permission.",
    "",
    "**/pingtoggle status** — View which vanity groups currently have pings enabled or disabled.",
    "",
    "**/help** — Shows this message.",
  ];

  await interaction.editReply({ content: lines.join("\n") });
}
