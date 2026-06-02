import "dotenv/config";

export const config = {
  token: process.env.DISCORD_TOKEN,
  clientId: process.env.DISCORD_CLIENT_ID,
  guildId: process.env.DISCORD_GUILD_ID,
  logChannelId: process.env.LOG_CHANNEL_ID,
};

// Vanity groups to monitor.
// Key = display name, value = string to look for in a user's status.
export const vanityGroups = {
  FaZe: "/faze",
  Member: "/member",
  Fraid: "/fraid",
  "Sharingan tag": "/sharingan",
  Rockstar: "/rockstar",
};
