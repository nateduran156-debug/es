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

// ─── Client Setup ────────────────────────────────────────────────────────────

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
  ],
  partials: [Partials.GuildMember],
});

// ─── Load Commands ────────────────────────────────────────────────────────────

client.commands = new Collection();

const commands = [roleCommand, pingToggleCommand];

for (const command of commands) {
  client.commands.set(command.data.name, command);
}

// ─── Event: Ready ─────────────────────────────────────────────────────────────

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// ─── Event: Interaction (Slash Commands) ──────────────────────────────────────

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    console.warn(`No command found for: ${interaction.commandName}`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`Error running /${interaction.commandName}:`, error);

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

// ─── Event: Presence Update (Vanity Detection) ────────────────────────────────

client.on(presenceUpdateEvent.name, (...args) =>
  presenceUpdateEvent.execute(...args)
);

// ─── Start ────────────────────────────────────────────────────────────────────

client.login(config.token);
