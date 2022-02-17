const { getSettings } = require("../modules/functions.js");
// This event executes when a new member joins a server. Let's welcome them!

module.exports = (client, member) => {
  // Load the guild's settings
  const guild = member.guild;
	const userRole = guild.roles.cache.find(role => role.name === "User");
	member.roles.add(userRole);
  await member.setNickname('0xFFFF');
};
