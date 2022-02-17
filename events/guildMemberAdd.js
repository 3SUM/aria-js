module.exports = (client, member) => {
  // Load the guild's settings
  const guild = member.guild;
  const userRole = guild.roles.cache.find((role) => role.name === "User");
  member.roles.add(userRole);
  await member.setNickname("0xFFFF");
};
