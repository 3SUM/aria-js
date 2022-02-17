const { Constants } = require("discord.js");

exports.run = async (client, interaction) => {
  try {
    const { member, options, channel } = interaction;
    const num = options.getNumber("num");
    // 101
    let remaining = num;
    while (remaining > 0) {
      const limit = remaining > 100 ? 100 : remaining;
      remaining = remaining > 100 ? remaining - 100 : 0;

      await channel.bulkDelete(limit);
    }
    return await interaction.reply({
      content: `cleared ${num} message(s)`,
      ephemeral: true,
    });
  } catch (e) {
    console.log(e);
    return await interaction.reply(
      `There was a problem with your request.\n\`\`\`${e.message}\`\`\``
    );
  }
};

exports.commandData = {
  name: "clear",
  description: "Clear [n] messages from text channel.",
  options: [
    {
      name: "num",
      description: "Number of messages to clear.",
      required: true,
      type: Constants.ApplicationCommandOptionTypes.NUMBER,
    },
  ],
  defaultPermission: true,
};

// Set guildOnly to true if you want it to be available on guilds only.
// Otherwise false is global.
exports.conf = {
  permLevel: "Administrator",
  guildOnly: true
};
