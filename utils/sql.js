const { Client } = require("pg");

const sqlClient = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const queryText =
  "CREATE TABLE IF NOT EXISTS onlycode (userid VARCHAR(255) NOT NULL, karma INTEGER, UNIQUE(userid))";

module.exports = {
  async query(someQuery, someValues) {
    const res = await sqlClient.query(someQuery, someValues);
    return res;
  },
  async startSQL() {
    try {
      const res = await sqlClient.connect();
      await sqlClient.query(queryText);
      return res;
    } catch (e) {
      console.log(e);
    }
  },

  // sets karma to zero or smallest int if they are passed in
  // otherwise does Currentkarma + value
  async karmaQuery(member, value) {
    try {
      let insertKarmaQuery = "";
      let valueString = "";

      valueString = String(value);

      if (value === 0 || value === -2147483647) {
        insertKarmaQuery =
          "INSERT INTO onlycode (userid, karma) VALUES ($1, $2) ON CONFLICT (userid) DO UPDATE SET karma = " +
          valueString;
      } else {
        insertKarmaQuery =
          "INSERT INTO onlycode (userid, karma) VALUES ($1, $2) ON CONFLICT (userid) DO UPDATE SET karma = onlycode.karma + " +
          valueString;
      }
      const karmaValues = [member.id, value];

      const res = await sqlClient.query(insertKarmaQuery, karmaValues);
      return res;
    } catch (e) {
      console.log(e);
    }
  },
};
