/* eslint-disable space-before-function-paren */
const fs = require("fs");
const path = require("path");
const fetchMessages = require("../utils/fetchMessages");

exports.run = async (client, interaction) => {
  try {
    const { channel, guild } = interaction;

    const isTicketChannel = channel.name.indexOf("ticket");

    if (isTicketChannel !== -1) {
      const messages = await fetchMessages(channel);

      const messagesArr = [];

      messages.each((message) => {
        messagesArr.push(
          `User: ${message.author.username} -> ${message.content}\n`
        );
      });

      const reversed = messagesArr.reverse();
      const userInf = reversed[0];
      const split = userInf.split("@");
      const secondSplit = split[1].split(">");
      const theirId = secondSplit[0];
      const ogMember = await guild.members.fetch(theirId);

      const keys = Object.keys(reversed);

      const writer = fs.createWriteStream(path.join(__dirname, "./ticket.txt"));

      keys.forEach(function (index) {
        writer.write(reversed[index]);
      });

      const ticketPath = path.join(__dirname, "./ticket.txt");

      const DM = await ogMember.createDM();
      await DM.send({
        content: "Your ticket has been closed, attached is the ticket history:",
        files: [
          {
            attachment: ticketPath,
            name: "ticket.txt",
          },
        ],
      });

      await channel.delete();
    } else {
      return await interaction.reply("Unable to close, this is not a ticket!");
    }
  } catch (e) {
    console.log(e);
    return await interaction.reply(
      `There was a problem with your request.\n\`\`\`${e.message}\`\`\``
    );
  }
};

exports.commandData = {
  name: "close",
  description: "Close ticket and send ticket history to user.",
};

exports.conf = {
  permLevel: "User",
  guildOnly: true,
};
