const server = require("./src/app.js");
const { conn } = require("./src/libs/postgres.js");
let { allData } = require("./src/bulkcreate.js");
const { ENV } = require('./src/libs/config.js');


// Syncing all the models at once.
conn.sync({ force: true }).then(() => {
  try {
  server.listen(ENV.api_port, async() => {
    await allData();
    console.log("Data loaded");
    console.log(`server is running on port ${ENV.api_port}`); // eslint-disable-line no-console
  });
} catch (error) {
  console.log(error);
}
});
