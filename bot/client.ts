import { GatewayIntentBits } from "discord-api-types/v9";
import { Client, Intents } from "discord.js";
import { token } from "~secret/discord.json";

const client: Client = new Client({
  intents: 38479,
});

client.login(token);
export { client };
