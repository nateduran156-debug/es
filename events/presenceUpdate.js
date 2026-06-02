import { EmbedBuilder } from "discord.js";
import { config, vanityGroups } from "../config.js";
import { isPingEnabled } from "../pingSettings.js";

/**
 * Fires whenever a member's presence (status/activity) changes.
 * Checks if their custom status contains any tracked vanity string.
 */
export const name = "presenceUpdate";

export async function execute(oldPresence, newPresence) {
  if (!newPresence?.member || newPresence.member.user.bot) return;

  const member = newPresence.member;

  // Pull the custom status text from the new presence
  const customStatus = newPresence.activities?.find(
    (a) => a.type === 4 // ActivityType.Custom = 4
  );
  const statusText = customStatus?.state?.toLowerCase() ?? "";

  for (const [groupName, vanityString] of Object.entries(vanityGroups)) {
    if (!statusText.includes(vanityString.toLowerCase())) continue;

    // Check if this group had the vanity before — skip if nothing changed
    const oldCustomStatus = oldPresence?.activities?.find((a) => a.type === 4);
    const oldStatusText = oldCustomStatus?.state?.toLowerCase() ?? "";
    if (oldStatusText.includes(vanityString.toLowerCase())) continue;

    // New detection — send the log
    const logChannel = await newPresence.guild.channels
      .fetch(config.logChannelId)
      .catch(() => null);

    if (!logChannel?.isTextBased()) continue;

    const pingMessage = isPingEnabled(groupName) ? "@everyone" : "";

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setAuthor({
        name: `${member.user.username} · vanity detected`,
        iconURL: member.user.displayAvatarURL({ dynamic: true }),
      })
      .setThumbnail(member.user.displayAvatarURL({ size: 256, dynamic: true }))
      .setDescription("━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
      .addFields(
        { name: "repping", value: vanityString, inline: false },
        { name: "status", value: customStatus?.state ?? "N/A", inline: false },
        { name: "id", value: member.user.id, inline: false }
      )
      .setFooter({
        text: `vanity system | Today at ${new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        })}`,
        iconURL: newPresence.guild.iconURL({ dynamic: true }) ?? undefined,
      });

    await logChannel.send({
      content: pingMessage || undefined,
      embeds: [embed],
      allowedMentions: { parse: isPingEnabled(groupName) ? ["everyone"] : [] },
    });
  }
}
