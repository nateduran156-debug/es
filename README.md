# Vanity Log Bot

A Discord bot that detects vanity URLs in member statuses, pings @everyone in your log channel, and lets admins assign group tag roles.

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create your `.env` file

Copy the example and fill in your values:

```bash
cp .env.example .env
```

| Variable | Where to find it |
|---|---|
| `DISCORD_TOKEN` | Discord Developer Portal → Your App → Bot → Reset Token |
| `DISCORD_CLIENT_ID` | Discord Developer Portal → Your App → General Information |
| `DISCORD_GUILD_ID` | Right-click your server icon → Copy Server ID |
| `LOG_CHANNEL_ID` | Right-click your log channel → Copy Channel ID |

### 3. Register slash commands

Run this once before starting the bot:

```bash
npm run deploy
```

### 4. Start the bot

```bash
npm start
```

---

## Deploy to Railway

1. Push this folder to a GitHub repo.
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub repo.
3. Select your repo.
4. Go to your service → **Variables** and add all 4 env variables from the table above.
5. Railway will build and start the bot automatically.

The `railway.toml` file is already configured — no extra setup needed.

---

## Commands

| Command | Description |
|---|---|
| `/role tag:<tag>` | Assigns you a group tag role. Running it again removes it. |
| `/pingtoggle set group:<group> enabled:<true/false>` | Turn @everyone pings on or off for a vanity group. (Requires Manage Server) |
| `/pingtoggle status` | View current ping settings for all groups. |

---

## Vanity Groups

Edit `config.js` to add, remove, or rename vanity groups and the strings the bot looks for in member statuses.

```js
export const vanityGroups = {
  FaZe: "/faze",
  Member: "/member",
  Fraid: "/fraid",
  "Sharingan tag": "/sharingan",
  Rockstar: "/rockstar",
};
```

---

## Required Bot Permissions

When inviting the bot, make sure it has:

- **Read Messages / View Channels**
- **Send Messages**
- **Mention Everyone**
- **Manage Roles** (for the `/role` command)

And these **Privileged Gateway Intents** (enabled in the Developer Portal → Bot):

- **Server Members Intent**
- **Presence Intent**
