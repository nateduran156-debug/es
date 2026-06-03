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

  const role = interaction.guild.roles.cache.find(
    (r) => r.name.toLowerCase() === selectedTag.toLowerCase()
  );

  if (!role) {
    return interaction.editReply({
      content: `The ${selectedTag} role does not exist on this server. Ask an admin to create it first.`,
    });
  }

  const member = interaction.member;

  // Toggle: remove if they already have it
  if (member.roles.cache.has(role.id)) {
    await member.roles.remove(role);
    return interaction.editReply({
      content: `Removed the ${selectedTag} tag from your profile.`,
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

  return interaction.editReply({
    content: `You have been assigned the ${selectedTag} tag.`,
  });
}
