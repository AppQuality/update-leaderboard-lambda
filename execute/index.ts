import { main } from "../lambda";

const db = require("../lib/db-config-local.json");

process.env = {
  ...db,
  ...process.env,
};
main();
