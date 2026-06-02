import "dotenv/config";
import {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
} from "discord.js";
import { config } from "./config.js";

// Commands
import * as roleCommand from "./commands/role.js";
import * as pingToggleCommand from "./commands/pingtoggle.js";

// Events
import * as presenceUpdateEvent from "./events/presenceUpdate.js";

// ─── Client Setup ─────────────────────────────────────────────────────────────

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
  ],
  partials: [Partials.GuildMember],
});

// ─── Load Commands ─────────────────────────────────────────────────────────────

client.commands = new Collection();

const commands = [roleCommand, pingToggleCommand];

for (const command of commands) {
  client.commands.set(command.data.name, command);
}

// ─── Event: Ready ──────────────────────────────────────────────────────────────

client.once("ready", () => {
  console.log(`[BOT] Logged in as ${client.user.tag}`);
  console.log(`[BOT] Serving ${client.guilds.cache.size} server(s)`);
});

// ─── Event: Interaction (Slash Commands) ───────────────────────────────────────

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    console.warn(`[CMD] Unknown command: ${interaction.commandName}`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`[CMD] Error running /${interaction.commandName}:`, error);

    const reply = {
      content: "Something went wrong while running that command.",
      ephemeral: true,
    };

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(reply);
    } else {
      await interaction.reply(reply);
    }
  }
});

// ─── Event: Presence Update (Vanity Detection) ─────────────────────────────────

client.on(presenceUpdateEvent.name, (...args) =>
  presenceUpdateEvent.execute(...args)
);

// ─── Discord Connection Error Handling ─────────────────────────────────────────

client.on("error", (error) => {
  console.error("[BOT] Client error:", error);
});

client.on("warn", (message) => {
  console.warn("[BOT] Warning:", message);
});

client.on("disconnect", () => {
  console.warn("[BOT] Disconnected from Discord. Reconnecting automatically...");
});

// ─── Process-Level Error Handling (prevents Railway crashes) ───────────────────

process.on("unhandledRejection", (reason) => {
  console.error("[PROCESS] Unhandled promise rejection:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("[PROCESS] Uncaught exception:", error);
  // Give Discord.js time to log the error before the process exits
  setTimeout(() => process.exit(1), 500);
});

// ─── Graceful Shutdown (Railway sends SIGTERM before stopping the container) ───

async function shutdown(signal) {
  console.log(`[BOT] Received ${signal}. Shutting down gracefully...`);
  client.destroy();
  process.exit(0);
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

// ─── Start ─────────────────────────────────────────────────────────────────────

console.log("[BOT] Starting...");
client.login(config.token);
