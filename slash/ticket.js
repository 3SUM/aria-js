const {
  Constants,
  MessageEmbed,
  Formatters,
  Permissions,
} = require("discord.js");

exports.run = async (client, interaction) => {
  try {
    const { channelId, options, member, guild, user } = interaction;

    const channel = guild.channels.cache.get(process.env.REQUEST_CHANNEL_ID);
    /* Formatters */
    const userMention = Formatters.userMention(member.id);
    const channelMention = Formatters.channelMention(channel.id);

    // Make sure ticket is requested in right channel
    if (channelId == channel) {
      const courseNum = options.getNumber("course");

      try {
        // Valid course
        const ticketChannelName = `ticket-${courseNum}-${user.username.toLowerCase()}`;

        // Make sure this channel doesn't exist yet
        const findChannel = guild.channels.cache.find(
          (channel) => channel.name === ticketChannelName
        );

        // Channel exists send error
        if (findChannel !== undefined) {
          const failEmbed = new MessageEmbed();
          failEmbed.setTitle("Failed to create a ticket");
          failEmbed.setDescription(
            "You already have a ticket open, please don't try to open a ticket while you already have one."
          );
          failEmbed.setColor("0xE73C24");
          return interaction.reply({
            embeds: [failEmbed],
          });
        } else {
          const ticketCategory = await guild.channels.cache.find(
            (channel) => channel.name === "Tickets"
          );
          const moderatorRole = await guild.roles.cache.find(
            (role) => role.name === "Moderator"
          );
          const userRole = await guild.roles.cache.find(
            (role) => role.name === "User"
          );

          // Everyone else can't view the channel except creator and TA's
          const userOverWrite = {
            id: userRole,
            deny: [Permissions.FLAGS.VIEW_CHANNEL],
          };

          const memberOverWrite = {
            id: member,
            allow: [Permissions.FLAGS.VIEW_CHANNEL],
          };

          const moderatorOverWrite = {
            id: moderatorRole,
            allow: [Permissions.FLAGS.VIEW_CHANNEL],
          };

          // Create ticket channel under ticket category with above overwrites
          const ticketCreate = await guild.channels.create(
            `${ticketChannelName}`,
            {
              type: "GUILD_TEXT",
              permissionOverwrites: [
                userOverWrite,
                memberOverWrite,
                moderatorOverWrite,
              ],
              parent: ticketCategory,
            }
          );

          const ticketChannelMention = Formatters.channelMention(
            ticketCreate.id
          );

          const embedInfo = new MessageEmbed();
          embedInfo.setTitle("Ticket");
          embedInfo.setDescription(
            `${userMention}, your ticket was successfully created: ${ticketChannelMention}`
          );
          embedInfo.setColor("0x15A513");

          // Creates the embed that gets sent in the ticket channel
          const ticketChannelEmbed = new MessageEmbed();
          ticketChannelEmbed.setTitle("Ticket");
          ticketChannelEmbed.setDescription(
            `${userMention}\n Please ask your question and a Moderator will be with you shortly.`
          );
          ticketChannelEmbed.setFooter(
            `Ticket requested by ${member.user.tag}`,
            member.user.displayAvatarURL({
              dynamic: true,
            })
          );
          ticketChannelEmbed.setColor("0x15A513");

          // sends the ticket embed in the ticket channel
          ticketCreate.send({
            content: `Hello ${userMention}`,
            embeds: [ticketChannelEmbed],
          });

          // sends the earlier embed in the request channel
          interaction.reply({
            embeds: [embedInfo],
          });
        }
      } catch (err) {
        const failEmbed = new MessageEmbed();
        failEmbed.setTitle("Failed to create a ticket");
        failEmbed.setDescription(
          `Ticket must be created in ${channelMention}!`
        );
        failEmbed.setColor("0xE73C24");
        interaction.reply({
          embeds: [failEmbed],
        });
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
  name: "ticket",
  description: "Create ticket request.",
  options: [
    {
      name: "course",
      description: "Which course to create the ticket for.",
      required: true,
      type: Constants.ApplicationCommandOptionTypes.NUMBER,
      choices: [
        {
          name: "135",
          value: 135,
        },
        {
          name: "202",
          value: 202,
        },
        {
          name: "218",
          value: 218,
        },
        {
          name: "370",
          value: 370,
        },
      ],
    },
  ],
};

exports.conf = {
  permLevel: "User",
  guildOnly: true,
};
