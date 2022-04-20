import { main } from "../lambda";
import DB from "../lambda/db";
import getCurrentLeaderboard from "../lambda/getCurrentLeaderboard";
import getLevels from "../lambda/getLevels";
import runUpdates from "../lambda/runUpdates";
import expectedUpdates from "./expectedUpdates";
import mockLeaderboard from "./mockLeaderboard";
import mockLevels from "./mockLevels";

const db = require("../lib/db-config-staging.json");

process.env = {
  ...db,
  ...process.env,
};
jest.mock("../lambda/db");
jest.mock("../lambda/runUpdates");
jest.mock("../lambda/getCurrentLeaderboard");
jest.mock("../lambda/getLevels");
let actualUpdates: any[] = [];
beforeAll(() => {
  (getCurrentLeaderboard as jest.Mock).mockImplementation(() => {
    return mockLeaderboard;
  });
  (getLevels as jest.Mock).mockImplementation(() => {
    return mockLevels;
  });
  (runUpdates as jest.Mock).mockImplementation((db, updates) => {
    actualUpdates = updates;
  });
  (DB as jest.Mock).mockImplementation(() => {
    return {
      destroy: () => {},
    };
  });
});
test("Correct updates", async () => {
  await main();
  expect(actualUpdates).toEqual(expectedUpdates);
});
