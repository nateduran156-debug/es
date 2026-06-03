import "dotenv/config";
import {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
  REST,
  Routes,
} from "discord.js";
import { config } from "./config.js";

// Commands
import * as roleCommand from "./commands/role.js";
import * as pingToggleCommand from "./commands/pingtoggle.js";
import * as helpCommand from "./commands/help.js";

// Events
import * as presenceUpdateEvent from "./events/presenceUpdate.js";

// ─── Validate Required Env Vars ───────────────────────────────────────────────

const required = ["DISCORD_TOKEN", "DISCORD_CLIENT_ID", "DISCORD_GUILD_ID", "LOG_CHANNEL_ID"];
const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(`[BOT] Missing required environment variables: ${missing.join(", ")}`);
  console.error("[BOT] Add them in Railway under your service Variables tab.");
  process.exit(1);
}

// ─── Client Setup ─────────────────────────────────────────────────────────────

const PREFIX = ".";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.GuildMember],
});

// ─── Load Commands ─────────────────────────────────────────────────────────────

client.commands = new Collection();

const commands = [roleCommand, pingToggleCommand, helpCommand];

for (const command of commands) {
  client.commands.set(command.data.name, command);
}

// ─── Register Slash Commands with Discord ─────────────────────────────────────

async function registerCommands() {
  const rest = new REST({ version: "10" }).setToken(config.token);
  const body = commands.map((c) => c.data.toJSON());

  try {
    console.log("[CMD] Registering slash commands...");
    await rest.put(
      Routes.applicationGuildCommands(config.clientId, config.guildId),
      { body }
    );
    console.log("[CMD] Slash commands registered successfully.");
  } catch (error) {
    console.error("[CMD] Failed to register slash commands:", error.message);
  }
}

// ─── Event: Ready ──────────────────────────────────────────────────────────────

client.once("clientReady", async (readyClient) => {
  console.log(`[BOT] Logged in as ${readyClient.user.tag}`);
  console.log(`[BOT] Serving ${readyClient.guilds.cache.size} server(s)`);
  await registerCommands();
});

// ─── Event: Slash Commands ─────────────────────────────────────────────────────

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    console.warn(`[CMD] Unknown command: ${interaction.commandName}`);
    await interaction.reply({ content: "That command does not exist.", ephemeral: true });
    return;
  }

  try {
    await interaction.deferReply({ ephemeral: true });
  } catch (err) {
    console.error(`[CMD] Failed to defer /${interaction.commandName}:`, err.message);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`[CMD] Error running /${interaction.commandName}:`, error);
    await interaction.editReply({ content: "Something went wrong. Please try again." });
  }
});

// ─── Event: Prefix Commands ───────────────────────────────────────────────────

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/\s+/);
  const commandName = args.shift().toLowerCase();

  if (commandName === "help") {
    return message.reply(
      "**Commands**\n\n" +
      "/role — Assign yourself a group tag (FaZe, Member, Fraid, Sharingan tag, Rockstar)\n" +
      "/pingtoggle set — Turn @everyone pings on or off for a vanity group\n" +
      "/pingtoggle status — View current ping settings\n" +
      "/help — Show this message\n\n" +
      "Use the slash commands above by typing / in the message bar."
    );
  }

  await message.reply("Use slash commands by typing / in the message bar to see all options.");
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

// ─── Process-Level Error Handling ──────────────────────────────────────────────

process.on("unhandledRejection", (reason) => {
  console.error("[PROCESS] Unhandled promise rejection:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("[PROCESS] Uncaught exception:", error);
  setTimeout(() => process.exit(1), 500);
});

// ─── Graceful Shutdown ─────────────────────────────────────────────────────────

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
