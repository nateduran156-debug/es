import {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js";

const SEP = "───────────────────────────────";

interface CommandEntry {
  name: string;
  desc: string;
}

export const CATEGORIES: Record<string, { label: string; description: string; commands: CommandEntry[] }> = {
  setup: {
    label: "Setup",
    description: "Server configuration",
    commands: [
      { name: "/setupticket #channel [type]",    desc: "Sends the ticket panel to a channel. Type can be `verification`, `tag`, or `both` (default: both)." },
      { name: "/logset #channel",                desc: "Sets the channel where ticket close logs are sent." },
      { name: "/taglogset #channel",             desc: "Sets the channel where tag approval logs are sent." },
      { name: "/botlogset #channel",             desc: "Sets the channel where all bot activity is logged." },
      { name: "/gid <groupId>",                  desc: "Sets the Roblox group ID used for verification checks." },
      { name: "/vset @role",                     desc: "Sets the role members receive when they get verified." },
      { name: "/vmr add @role",                  desc: "Adds a role to the verification manager list — they can verify, kick, and close tickets." },
      { name: "/vmr remove @role",               desc: "Removes a role from the verification manager list." },
      { name: "/vmr list",                       desc: "Shows all current verification manager roles." },
      { name: "/prefix <new>",                   desc: "Changes the command prefix for this server." },
    ],
  },
  groups: {
    label: "Groups & Verification",
    description: "Group checks and verification",
    commands: [
      { name: "/gc <username>",                  desc: "Runs a full group check on a Roblox user — shows all groups, flags, and main group membership." },
      { name: "/flag <groupId>",                 desc: "Flags a Roblox group. Members in flagged groups will be marked in verification tickets." },
      { name: "/unflag <groupId>",               desc: "Removes a group from this server's flagged list." },
      { name: "/flist",                          desc: "Lists all flagged groups — both global and server-specific." },
      { name: "/verify @user [username]",        desc: "Manually gives a member the verified role. Optionally links their Roblox username." },
      { name: "/unverify @user",                 desc: "Removes the verified role from a member." },
    ],
  },
  tags: {
    label: "Tags",
    description: "Tag assignment and management",
    commands: [
      { name: "/role <roblox> <tag>",            desc: "Assigns a Roblox tag to a user directly. Use the tag name set via `/sr`." },
      { name: "/sr <name>",                      desc: "Adds a custom tag option that can be used with `/role`." },
      { name: "/tmr @role",                      desc: "Sets the tag manager role — members with this role can approve and deny tag requests." },
      { name: "/wlrole @role [command]",         desc: "Gives a role access to a specific command. Leave command blank for tag manager access." },
    ],
  },
  points: {
    label: "Points",
    description: "Raid points system",
    commands: [
      { name: "/register <username>",            desc: "Links your Discord account to your Roblox username. Required before submitting raid point requests." },
      { name: "/rankup @user [amount]",          desc: "Adds raid points to a member. Optionally specify an amount (default: 1)." },
      { name: "/removepoints @user [amount]",    desc: "Removes raid points from a member. Optionally specify an amount (default: 1)." },
      { name: "/check [@user]",                  desc: "Shows your or another member's current raid point total." },
      { name: "/leaderboard",                    desc: "Shows the top 15 raid point holders in the server." },
      { name: "/resetall",                       desc: "Wipes all raid points in the server — prompts for confirmation first." },
      { name: "/raidpointspanel #channel",       desc: "Sends the raid point request panel to a channel." },
      { name: "/leaderboardpanel #channel",      desc: "Sends a live leaderboard panel that auto-refreshes every 10 minutes." },
      { name: "/wlp @role",                      desc: "Gives a role full access to all raid points commands." },
      { name: "/psr @role",                      desc: "Sets the points support role — they can review requests and use check, lb, and rankup." },
    ],
  },
  ranks: {
    label: "Ranks",
    description: "Rank role configuration",
    commands: [
      { name: "/addrank <roleId> <points> [name]", desc: "Adds a rank tier. Members auto-promote when their points hit the threshold. Max 30 ranks." },
      { name: "/removerank <roleId>",              desc: "Removes a rank tier from the configuration." },
      { name: "/ranks",                            desc: "Lists all configured rank tiers, sorted by points required." },
    ],
  },
  tracker: {
    label: "Tracker",
    description: "Roblox player tracking",
    commands: [
      { name: "/track add <username>",           desc: "Adds a Roblox user to your tracking list. You'll get a ping when they hop in a game." },
      { name: "/track remove <username>",        desc: "Removes a Roblox user from your tracking list." },
      { name: "/track list",                     desc: "Shows all the Roblox users you're currently tracking." },
      { name: "/track check <username>",         desc: "Checks a tracked user's current activity status right now." },
      { name: "/track alert <username> [game]",  desc: "Only get notified when a tracked user joins a specific game. Leave game blank to get all alerts." },
      { name: "/track settings [dm_on_join]",    desc: "Shows your current tracker settings. Optionally toggle DM alerts on or off." },
      { name: "/track notify [#channel]",        desc: "Sets where tracker alerts are sent. Leave channel blank to switch back to DMs." },
    ],
  },
  vanity: {
    label: "Vanity Watcher",
    description: "Discord vanity URL monitoring",
    commands: [
      { name: "/vanity toggle",                  desc: "Turns the vanity watcher on or off for this server." },
      { name: "/vanity setlog #channel",         desc: "Sets the channel where vanity alerts are posted." },
      { name: "/vanity flag <vanity>",           desc: "Marks a Discord vanity URL as an opp vanity. Members repping it will be flagged." },
      { name: "/vanity unflagvanity <vanity>",   desc: "Removes a vanity from the opp list." },
      { name: "/vanity whitelist <vanity>",      desc: "Whitelists a vanity — members repping it will not be flagged." },
      { name: "/vanity unwhitelist <vanity>",    desc: "Removes a vanity from the whitelist." },
      { name: "/vanity opplist",                 desc: "Lists all vanities currently marked as opp." },
      { name: "/vanity vanities",                desc: "Lists all whitelisted vanities." },
      { name: "/vanity flagged",                 desc: "Lists all members currently repping an opp vanity." },
      { name: "/vanity unflag @user",            desc: "Manually removes the flag from a member." },
      { name: "/vanity scan",                    desc: "Scans all members for opp vanities right now." },
    ],
  },
  blacklist: {
    label: "Blacklist",
    description: "Roblox username blacklist",
    commands: [
      { name: "/blacklist add <username> [reason]", desc: "Adds a Roblox username to the blacklist. Blacklisted users are flagged immediately when they open a ticket." },
      { name: "/blacklist remove <username>",        desc: "Removes a Roblox username from the blacklist." },
      { name: "/blacklist check <username>",         desc: "Checks if a Roblox username is on the blacklist." },
      { name: "/blacklist list",                     desc: "Lists all blacklisted usernames along with their reason and who added them." },
    ],
  },
  whitelist: {
    label: "Whitelist",
    description: "Access control and permissions",
    commands: [
      { name: "/wl bot @user",                   desc: "Grants a user full access to every bot command." },
      { name: "/wl command <name> @user",        desc: "Grants a user access to one specific command." },
      { name: "/whitelisted",                    desc: "Shows all users and roles that have been whitelisted." },
    ],
  },
  bot: {
    label: "Bot Settings",
    description: "Bot customization and data",
    commands: [
      { name: "/setavatar [url or attachment]",  desc: "Changes the bot's profile picture — attach an image or paste a URL." },
      { name: "/setbanner [url or attachment]",  desc: "Changes the bot's banner — requires Nitro on the bot account." },
      { name: "/setusername <name>",             desc: "Changes the bot's global username — Discord rate-limits this, use it sparingly." },
      { name: "/setnickname [name]",             desc: "Changes the bot's nickname in this server — leave blank to reset." },
      { name: "/setstatus <text>",               desc: "Sets the bot's playing status. Use `clear` to remove it." },
      { name: "/setpresence <status>",           desc: "Sets presence to `online`, `idle`, `dnd`, or `invisible`." },
      { name: "/backup",                         desc: "Downloads all bot data as a JSON backup file." },
      { name: "/restore <file>",                 desc: "Restores bot data from a backup JSON file." },
    ],
  },
};

const DEFAULT_CATEGORY = "setup";

function buildSelectMenu(selected: string) {
  const menu = new StringSelectMenuBuilder()
    .setCustomId("help_category")
    .setPlaceholder("browse a category...")
    .addOptions(
      Object.entries(CATEGORIES).map(([value, cat]) =>
        new StringSelectMenuOptionBuilder()
          .setLabel(cat.label)
          .setValue(value)
          .setDescription(cat.description)
          .setDefault(value === selected),
      ),
    );
  return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menu);
}

export function buildHelpMessage(category: string = DEFAULT_CATEGORY): { embeds: object[]; components: unknown[] } {
  const cat = CATEGORIES[category] ?? CATEGORIES[DEFAULT_CATEGORY]!;
  const commandLines = cat.commands
    .map((c) => `\`${c.name}\`\n  ${c.desc}`)
    .join("\n\n");
  return {
    embeds: [{
      color: 0x6366f1,
      description: `${SEP}\n  **${cat.label}**  ·  ${cat.description}\n${SEP}\n\n${commandLines}\n\n${SEP}`,
      footer: { text: "◈  x2k  ·  select a category below" },
      timestamp: new Date().toISOString(),
    }],
    components: [buildSelectMenu(category)],
  };
}

export const ALL_COMMANDS = Object.values(CATEGORIES).flatMap((c) => c.commands);
export const PER_PAGE = 6;
export function buildPage(_page: number) { return buildHelpMessage(DEFAULT_CATEGORY); }
