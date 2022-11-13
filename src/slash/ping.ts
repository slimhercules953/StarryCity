import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import type { CommandLike } from "./command";

export default <CommandLike>{
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("pong."),
	async execute(client, interaction) {
		const replyEmbed = new EmbedBuilder()
			.setColor("Green")
			.setTitle("Ping")
			.setDescription(
				"Pong!"
			)
			.setTimestamp();
		interaction.reply({ embeds: [replyEmbed] });
	},
};