import { GatewayIntentBits } from "discord-api-types/v9";
import { Client } from "discord.js";
import { token } from "secret/discord.json";

const client: Client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMessages,
  ],
});

client.login(token);
export { client };
