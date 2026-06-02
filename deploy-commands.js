/**
 * Run this once to register your slash commands with Discord:
 *   node deploy-commands.js
 */

import "dotenv/config";
import { REST, Routes } from "discord.js";
import { data as roleData } from "./commands/role.js";
import { data as pingToggleData } from "./commands/pingtoggle.js";

const commands = [roleData.toJSON(), pingToggleData.toJSON()];

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_BOT_TOKEN);

try {
  console.log("Registering slash commands...");

  await rest.put(
    Routes.applicationGuildCommands(
      process.env.DISCORD_CLIENT_ID,
      process.env.DISCORD_GUILD_ID
    ),
    { body: commands }
  );

  console.log("Slash commands registered successfully.");
} catch (error) {
  console.error("Failed to register commands:", error);
}

