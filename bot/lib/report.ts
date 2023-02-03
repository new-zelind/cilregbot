import { owner } from "~secret/discord.json";
import { Client, Message, User } from "discord.js";

export default function report(client: Client) {
  return async (error: Error): Promise<Message> => {
    const me: User = await client.users.fetch(owner);

    client.user?.setActivity("with errors", { type: "PLAYING" });

    return await me.send(`${error.stack}`);
  };
}
