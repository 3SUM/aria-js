const { Collection } = require("@discordjs/collection");

/**
 * function that is able to fetch up to 999 messages from a channel
 * If this is used with clear please note it will not clear messages older than 2 weeks
 * @param {Channel} channel
 * @param {Number} limit
 * @returns {Collection}
 */
const fetchMessages = async (channel, limit = 999) => {
  if (!channel) {
    throw new Error(`Expected channel, got ${typeof channel}.`);
  }
  if (limit <= 100) {
    // same code as before
    return channel.messages.fetch({
      limit,
    });
  }

  // there is more than 100 messages to grab, keep going
  // there is more than 100 messages keep going
  let collection = new Collection();
  let lastId = null;
  const options = {};
  let remaining = limit;

  // loop until we went through limit
  while (remaining > 0) {
    options.limit = remaining > 100 ? 100 : remaining;
    remaining = remaining > 100 ? remaining - 100 : 0;
    if (lastId) {
      options.before = lastId;
    }

    const messages = await channel.messages.fetch(options);

    if (!messages.last()) {
      break;
    }

    collection = collection.concat(messages);
    lastId = messages.last().id;
  }

  return collection;
};

module.exports = fetchMessages;
