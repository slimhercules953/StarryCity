import { commands } from "./slash/";
import {
	Client,
	Collection,
	GatewayIntentBits,
	Routes,
	ActivityType,
	RESTPostAPIChatInputApplicationCommandsJSONBody,
} from "discord.js";
import { REST } from "@discordjs/rest";
import { clientId, token } from "./config";
import type {
	CommandLike,
	ChatInputCommandAssertedInteraction,
} from "./slash/command";

if (!token) throw Error("No token!");
if (!clientId) throw Error("No clientId!");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const commandList = new Collection<string, CommandLike>();

const commandData: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];

for (const command of commands) {
	commandList.set(command.data.name, command);
	commandData.push(command.data.toJSON());
}

const rest = new REST({ version: "10" }).setToken(token);

rest
	.put(Routes.applicationCommands(clientId), { body: commandData })
	.then(() => console.log("Successfully registered application commands."))
	.catch(console.error);

client.once("ready", async () => {
	if (!client.user) throw Error("Unexpected: client.user is null");
	client.user.setActivity("/dap", { type: ActivityType.Listening });
	console.log("Connected to Discord API!");
	});

client.on("interactionCreate", async (interaction) => {
	if (!interaction.isChatInputCommand()) return;
	if (!interaction.guild) return;

	const command = commandList.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(
			client,
			interaction as ChatInputCommandAssertedInteraction
		);
	} catch (error) {
		console.error(error);
		await interaction.reply({
			content: "There was an error while executing this command!",
			ephemeral: true,
		});
	}
});

client.login(token);
