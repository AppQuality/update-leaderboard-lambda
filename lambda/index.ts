import getCurrentLeaderboard from "./getCurrentLeaderboard";
import getLevels from "./getLevels";
import runUpdates from "./runUpdates";

export async function main(): Promise<{ body: string; statusCode: 200 }> {
  // const db = new DB({
  //   host: process.env.DB_HOST || "",
  //   user: process.env.DB_USER || "",
  //   password: process.env.DB_PASS || "",
  //   database: process.env.DB_NAME || "",
  // });
  const db = {};
  const levels = getLevels(db);
  const currentLeaderboard = getCurrentLeaderboard(db);
  const BLACK_MEMBER_ID = 100;

  /**
   *
   * FUNCTIONS
   *
   */
  function isTesterBlackMember(tester: typeof currentLeaderboard[0]) {
    return tester.total_exp >= 100000;
  }

  function isTesterToDowngrade(tester: typeof currentLeaderboard[0]) {
    const currentLevel = levels.find((level) => level.id === tester.level);
    if (!currentLevel || !currentLevel.hold) {
      return false;
    }
    return tester.monthly_exp < currentLevel.hold;
  }

  function nextReachableLevel(tester: typeof currentLeaderboard[0]) {
    let nextLevel = null;
    for (const level of levels) {
      if (
        level.reach &&
        tester.level < level.id &&
        level.reach <= tester.monthly_exp
      ) {
        nextLevel = level;
      }
    }
    return nextLevel;
  }
  function previousReachableLevel(tester: typeof currentLeaderboard[0]) {
    let previousLevel = null;
    for (let i = 0; i < levels.length - 1; i++) {
      if (levels[i + 1].id === tester.level) {
        previousLevel = levels[i];
        break;
      }
    }
    return previousLevel;
  }
  function getTesterLevel(tester: typeof currentLeaderboard[0]) {
    return levels.find((level) => level.id === tester.level);
  }

  function levelObject(tester: typeof currentLeaderboard[0], level: number) {
    return {
      tester_id: tester.id,
      level,
    };
  }

  /**
   *
   *
   * MAIN LOGIC
   *
   *
   */

  let updates: ({ tester_id: number; level: number } | null)[] =
    currentLeaderboard.map((tester) => {
      if (isTesterBlackMember(tester)) {
        return levelObject(tester, BLACK_MEMBER_ID);
      }
      const currentLevel = getTesterLevel(tester);
      if (!currentLevel) {
        return null;
      }
      if (isTesterToDowngrade(tester)) {
        const previousLevel = previousReachableLevel(tester);
        if (previousLevel) {
          return levelObject(tester, previousLevel.id);
        }
      }
      let nextLevel = nextReachableLevel(tester);
      if (nextLevel) {
        return levelObject(tester, nextLevel.id);
      }
      return levelObject(tester, currentLevel.id);
    });

  runUpdates(db, updates);
  //db.destroy();
  return {
    body: JSON.stringify(updates),
    statusCode: 200,
  };
}
