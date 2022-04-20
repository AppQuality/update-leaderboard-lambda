import { main } from "../lambda";

const db = require("../lib/db-config-staging.json");

process.env = {
  ...db,
  ...process.env,
};
main();
