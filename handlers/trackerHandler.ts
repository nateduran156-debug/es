import type { Client } from "discord.js";
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { getAllTracks, updateLastGame, getDmOnJoin, getNotifyChannelId } from "../utils/trackerStorage.js";
import { getUserPresence, getGameName, getUniverseDetails, getUserAvatarUrl } from "../utils/roblox.js";

export async function runTrackerCycle(client: Client): Promise<void> {
  try {
    const tracks = getAllTracks();
    if (tracks.length === 0) return;

    // Group by roblox user to minimize API calls
    const grouped = new Map<number, typeof tracks>();
    for (const t of tracks) {
      const list = grouped.get(t.robloxUserId) ?? [];
      list.push(t);
      grouped.set(t.robloxUserId, list);
    }

    for (const [robloxUserId, entries] of grouped) {
      try {
        const presence = await getUserPresence(robloxUserId);
        if (!presence) continue;

        const currentPlaceId = presence.placeId ?? null;
        const currentUniverseId = presence.universeId ?? null;
        const isInGame = presence.userPresenceType === 2;

        const rawGameId = presence.gameId ?? null;
        const sessionKey = rawGameId ?? (currentPlaceId ? `p:${currentPlaceId}` : null);

        for (const entry of entries) {
          const wasInGame = entry.lastGameId !== null;

          let sessionChanged = false;
          if (wasInGame) {
            const prevIsPlaceFallback = entry.lastGameId!.startsWith("p:");
            const currIsPlaceFallback = rawGameId === null;

            if (!prevIsPlaceFallback && !currIsPlaceFallback) {
              sessionChanged = entry.lastGameId !== rawGameId;
            } else if (prevIsPlaceFallback && currIsPlaceFallback) {
              sessionChanged = entry.lastGameId !== sessionKey;
            } else {
              sessionChanged = entry.lastPlaceId !== currentPlaceId;
            }
          }

          if (isInGame && (!wasInGame || sessionChanged)) {
            updateLastGame(entry.discordUserId, robloxUserId, sessionKey, currentPlaceId ?? null);

            if (!getDmOnJoin(entry.discordUserId)) continue;

            let gameName = "Unknown Game";
            if (currentUniverseId) {
              const details = await getUniverseDetails(currentUniverseId);
              gameName = details?.name ?? gameName;
            } else if (currentPlaceId) {
              gameName = await getGameName(currentPlaceId);
            }

            if (entry.alertGame) {
              if (!gameName.toLowerCase().includes(entry.alertGame.toLowerCase())) continue;
            }

            const avatarUrl = await getUserAvatarUrl(robloxUserId);

            const hasSpecificServer = rawGameId !== null && currentPlaceId !== null;
            const joinUrl = hasSpecificServer
              ? `https://www.roblox.com/games/start?placeId=${currentPlaceId}&gameInstanceId=${rawGameId}`
              : currentPlaceId
                ? `https://www.roblox.com/games/${currentPlaceId}`
                : null;

            const embed = new EmbedBuilder()
              .setColor(0x4f46e5)
              .setAuthor({
                name: entry.robloxUsername,
                iconURL: avatarUrl ?? undefined,
                url: `https://www.roblox.com/users/${robloxUserId}/profile`,
              })
              .setTitle("player activity")
              .setDescription(
                `**${entry.robloxUsername}** is now in a server\n\n` +
                `**game** — ${gameName}` +
                (entry.alertGame ? `\n**filter** — \`${entry.alertGame}\`` : "")
              )
              .addFields(
                { name: "roblox id", value: `\`${robloxUserId}\``, inline: true },
                { name: "link type", value: hasSpecificServer ? "direct server" : "game page", inline: true },
              )
              .setFooter({ text: "tracker system" })
              .setTimestamp();

            const components = joinUrl
              ? [
                  new ActionRowBuilder<ButtonBuilder>().addComponents(
                    new ButtonBuilder()
                      .setLabel(hasSpecificServer ? "Join Server" : "Open Game")
                      .setStyle(hasSpecificServer ? ButtonStyle.Success : ButtonStyle.Secondary)
                      .setURL(joinUrl)
                  ),
                ]
              : [];

            try {
              const notifyChannelId = getNotifyChannelId(entry.discordUserId);
              if (notifyChannelId) {
                // Send to the configured server channel
                const channel = await client.channels.fetch(notifyChannelId).catch(() => null) as import("discord.js").TextChannel | null;
                if (channel?.isTextBased()) {
                  await channel.send({ content: `<@${entry.discordUserId}>`, embeds: [embed], components });
                }
              } else {
                // Fall back to DMs
                const discordUser = await client.users.fetch(entry.discordUserId);
                await discordUser.send({ embeds: [embed], components });
              }
            } catch {
              // Channel inaccessible or DMs closed — silently skip
            }

          } else if (!isInGame && wasInGame) {
            updateLastGame(entry.discordUserId, robloxUserId, null, null);
          }
        }
      } catch {
        // Skip individual user errors silently
      }
    }
  } catch (err) {
    console.error("[Tracker] Cycle error:", err);
  }
}
