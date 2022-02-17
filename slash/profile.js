/* eslint-disable no-useless-escape */
const { MessageEmbed, Constants } = require("discord.js");
const moment = require("moment");
const { query } = require("../utils/sql");

function trimArray(arr, maxLen = 25) {
  if (Array.from(arr.values()).length > maxLen) {
    const len = Array.from(arr.values()).length - maxLen;
    arr = Array.from(arr.values())
      .sort((a, b) => b.rawPosition - a.rawPosition)
      .slice(0, maxLen);
    arr.map((role) => `<@&${role.id}>`);
    arr.push(`${len} more...`);
  }
  return arr.join(", ");
}

exports.run = async (client, interaction) => {
  try {
    const { member, options } = interaction;
    const { guild } = member;

    let userOption = options.getUser("which_user");
    if (!userOption) userOption = member.user;

    const queryText = "SELECT karma FROM onlycode WHERE userid = $1";
    const values = [userOption.id];
    console.log("hereeee1");
    const userKarma = await query(queryText, values);
    let karmaNum = "0";
    if (userKarma.rowCount !== 0) {
      karmaNum = String(userKarma.rows[0].karma);
    }

    if (userOption === member.user) {
      try {
        const roles = member.roles;

        const embedInfo = new MessageEmbed();
        embedInfo.setThumbnail(
          member.user.displayAvatarURL({
            dynamic: true,
            size: 512,
          })
        );
        embedInfo.setAuthor(
          "Information about:   " +
            member.user.username +
            "#" +
            member.user.discriminator,
          member.user.displayAvatarURL({
            dynamic: true,
          })
        );
        embedInfo.addField("**❱ Username:**", `\`${member.user.tag}\``, true);
        embedInfo.addField(
          "**❱ Avatar:**",
          `[\`Link to avatar\`](${member.user.displayAvatarURL({
            format: "png",
          })})`,
          true
        );
        embedInfo.addField(
          "**❱ Joined Discord:**",
          "`" +
            moment(member.user.createdTimestamp).format("MM/DD/YYYY") +
            "`\n",
          true
        );
        embedInfo.addField(
          "**❱ Joined OnlyCode:**",
          "`" + moment(member.joinedTimestamp).format("MM/DD/YYYY") + "`\n",
          true
        );
        embedInfo.addField(
          "**❱ Highest Role:**",
          `${
            member.roles.highest.id === guild.id ? "None" : member.roles.highest
          }`,
          true
        );
        embedInfo.addField("**❱ Karma:**", karmaNum, true);
        embedInfo.addField(
          `❱ [${roles.cache.size - 1}] Roles: `,
          roles.cache.size < 25
            ? Array.from(roles.cache.values())
                .sort((a, b) => b.rawPosition - a.rawPosition)
                .filter((role) => role.name !== "@everyone")
                .map((role) => `<@&${role.id}>`)
                .join(", ")
            : roles.cache.size > 25
            ? trimArray(roles.cache)
            : "None"
        );
        embedInfo.setColor("#3498db");
        embedInfo.setFooter(
          "Aria",
          "https://cdn.discordapp.com/avatars/883431037563191350/0d70b343dc9da3e9546ae40c3ecc8846.png"
        );

        interaction.reply({
          embeds: [embedInfo],
        });
      } catch (e) {
        console.log(e);
      }
    } else {
      try {
        const embedInfo = new MessageEmbed();
        embedInfo.setThumbnail(
          userOption.displayAvatarURL({
            dynamic: true,
            size: 512,
          })
        );
        embedInfo.setAuthor(
          "Information about:   " +
            userOption.username +
            "#" +
            userOption.discriminator,
          userOption.displayAvatarURL({
            dynamic: true,
          })
        );
        embedInfo.addField("**❱ Username:**", `\`${userOption.tag}\``, true);
        embedInfo.addField(
          "**❱ Avatar:**",
          `[\`Link to avatar\`](${userOption.displayAvatarURL({
            format: "png",
          })})`,
          true
        );
        embedInfo.addField("**❱ Karma:**", karmaNum, true);
        embedInfo.setColor("#3498db");
        embedInfo.setFooter(
          "Aria",
          "https://cdn.discordapp.com/avatars/883431037563191350/0d70b343dc9da3e9546ae40c3ecc8846.png"
        );

        interaction.reply({
          embeds: [embedInfo],
        });
      } catch (e) {
        console.log(e);
      }
    }
  } catch (e) {
    console.log(e);
    return await interaction.reply(
      `There was a problem with your request.\n\`\`\`${e.message}\`\`\``
    );
  }
};

exports.commandData = {
  name: "profile",
  description: "Gets profile from self or mentioned user",
  options: [
    {
      name: "which_user",
      description: "WHOM?",
      required: false,
      type: Constants.ApplicationCommandOptionTypes.USER,
    },
  ],
};

// Set guildOnly to true if you want it to be available on guilds only.
// Otherwise false is global.
exports.conf = {
  permLevel: "User",
  guildOnly: true,
};
