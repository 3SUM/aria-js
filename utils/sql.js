const { Client } = require("pg");

const sqlClient = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const queryText =
  "CREATE TABLE IF NOT EXISTS onlycode (userid VARCHAR(255) NOT NULL, karma INTEGER, UNIQUE(userid))";
const pesoQuery =
  "CREATE TABLE IF NOT EXISTS gamble (userid VARCHAR(255) NOT NULL, pesos INTEGER, UNIQUE(userid))";

const hangQuery =
  "CREATE TABLE IF NOT EXISTS hangman ( id VARCHAR(255), running BOOL, UNIQUE(id))";

module.exports = {
  async query(someQuery, someValues) {
    const res = await sqlClient.query(someQuery, someValues);
    return res;
  },
  async startSQL() {
    try {
      const res = await sqlClient.connect();
      await sqlClient.query(queryText);
      await sqlClient.query(pesoQuery);
      await sqlClient.query(hangQuery);
      return res;
    } catch (e) {
      console.log(e);
    }
  },

  // sets pesos to zero or smallest int if they are passed in
  // otherwise does Currentpesos + value
  async pesoQuery(member, value) {
    try {
      let insertPesoQuery = "";
      let valueString = "";

      valueString = String(value);

      if (value === 0 || value === -2147483647) {
        insertPesoQuery =
          "INSERT INTO gamble (userid, pesos) VALUES ($1, $2) ON CONFLICT (userid) DO UPDATE SET pesos = " +
          valueString;
      } else {
        insertPesoQuery =
          "INSERT INTO gamble (userid, pesos) VALUES ($1, $2) ON CONFLICT (userid) DO UPDATE SET pesos = gamble.pesos + " +
          valueString;
      }
      const pesoValues = [member.id, value];

      const res = await sqlClient.query(insertPesoQuery, pesoValues);
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
