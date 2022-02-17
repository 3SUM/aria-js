/*
 * Finds the role name from the passed in guild or member
 * This is so that I don't have to type this long ass thing every time
 */
const roleFinder = async (memberOrGuild, roleName) => {
  if (memberOrGuild) {
    if (roleName) {
      return memberOrGuild.roles.cache.find((role) => role.name === roleName);
    } else {
      throw new Error(`Expected roleName, got ${typeof roleName}.`);
    }
  } else {
    throw new Error(`Expected Guild or member, got ${typeof memberOrGuild}.`);
  }
};

module.exports = roleFinder;
