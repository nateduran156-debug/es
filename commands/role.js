import { SlashCommandBuilder } from "discord.js";

const TAGS = ["FaZe", "Member", "Fraid", "Sharingan tag", "Rockstar"];

export const data = new SlashCommandBuilder()
  .setName("role")
  .setDescription("Assign yourself a group tag role.")
  .addStringOption((option) =>
    option
      .setName("tag")
      .setDescription("Choose the tag you want assigned to you.")
      .setRequired(true)
      .addChoices(...TAGS.map((tag) => ({ name: tag, value: tag })))
  );

export async function execute(interaction) {
  const selectedTag = interaction.options.getString("tag");

  // Find the role in the server that matches the tag name
  const role = interaction.guild.roles.cache.find(
    (r) => r.name.toLowerCase() === selectedTag.toLowerCase()
  );

  if (!role) {
    return interaction.reply({
      content: `The **${selectedTag}** role doesn't exist on this server yet. Ask an admin to create it.`,
      ephemeral: true,
    });
  }

  const member = interaction.member;

  // If they already have it, remove it (toggle behavior)
  if (member.roles.cache.has(role.id)) {
    await member.roles.remove(role);
    return interaction.reply({
      content: `Removed the **${selectedTag}** tag from you.`,
      ephemeral: true,
    });
  }

  // Remove any other tag roles first so they only hold one at a time
  const tagRoleIds = TAGS.map((tag) =>
    interaction.guild.roles.cache.find(
      (r) => r.name.toLowerCase() === tag.toLowerCase()
    )?.id
  ).filter(Boolean);

  await member.roles.remove(tagRoleIds);
  await member.roles.add(role);

  return interaction.reply({
    content: `You've been given the **${selectedTag}** tag.`,
    ephemeral: true,
  });
}
