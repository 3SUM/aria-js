const logger = require("../modules/Logger.js");
const { getSettings } = require("../modules/functions.js");
const { startSQL } = require("../utils/sql");
module.exports = async (client) => {
  // Log that the bot is online.
  logger.log(
    `${client.user.tag}, ready to serve ${client.guilds.cache
      .map((g) => g.memberCount)
      .reduce((a, b) => a + b)} users in ${client.guilds.cache.size} servers.`,
    "ready"
  );

  try {
    await startSQL();
  } catch (e) {
    console.log(e);
  }

  // Make the bot "play the game" which is the help command with default prefix.
  client.user.setActivity(`${getSettings("default").prefix}help`, {
    type: "PLAYING",
  });
};
