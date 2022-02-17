const roleFinder = require("./roleFinder");
const { query } = require("./sql");

const roleReward = async (member) => {
  // Query DB to get their karma
  const queryText = "SELECT karma FROM onlycode WHERE userid = $1";
  const values = [member.id];
  const memberKarma = await query(queryText, values);
  let karmaAmount = 0;
  if (memberKarma.rowCount !== 0) {
    karmaAmount = memberKarma.rows[0].karma;
  }

  const guild = member.guild;

  let karmaString = "none";

  /*  KARMA CHECKING */

  if (karmaAmount >= 20 && karmaAmount < 50) {
    // -> 20 karma, if not already assign active
    // checking if the member themselves has the role
    const activeRole = await roleFinder(member, "Active");
    if (!activeRole) {
      // they don't have the role let's give them the role
      const active = await roleFinder(guild, "Active");
      member.roles.add(active);
      karmaString = active.toString();
    }
  } else if (karmaAmount >= 50 && karmaAmount < 100) {
    // -> 50 karma, if not already assign contributor
    const contribRole = await roleFinder(member, "Contributor");
    if (!contribRole) {
      const contributor = await roleFinder(guild, "Contributor");
      member.roles.add(contributor);
      karmaString = contributor.toString();
    }
  } else if (karmaAmount >= 100) {
    // karma is 100 or above
    // checking if the member themselves has the role already
    const wizardRole = await roleFinder(member, "Wizard");
    if (!wizardRole) {
      // they don't have the role let's give them role
      const wizard = await roleFinder(guild, "Wizard");
      member.roles.add(wizard);
      karmaString = wizard.toString();
    }
  }

  return { karmaString };
};

module.exports = roleReward;
