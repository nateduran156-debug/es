import "dotenv/config";

export const config = {
  token: process.env.DISCORD_BOT_TOKEN,
  clientId: process.env.DISCORD_CLIENT_ID,
  guildId: process.env.DISCORD_GUILD_ID,
  logChannelId: process.env.LOG_CHANNEL_ID,
};

// Vanity groups to monitor. Add or remove entries as needed.
// The key is the display name; the value is the vanity string to look for in a user's status.
export const vanityGroups = {
  FaZe: "/faze",
  Member: "/member",
  Fraid: "/fraid",
  "Sharingan tag": "/sharingan",
  Rockstar: "/rockstar",
};

