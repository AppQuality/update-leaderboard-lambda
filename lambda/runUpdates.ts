export default async (
  db: { query: (query: string) => Promise<any> },
  updates: ({ tester_id: number; level: number; lastLevel: number } | null)[]
) => {
  let byLevel: { [key: number]: number[] } = {};
  let upgrades: number[] = [];
  let downgrades: number[] = [];
  updates.forEach((update) => {
    if (update) {
      if (!byLevel[update.level]) {
        byLevel[update.level] = [];
      }
      byLevel[update.level].push(update.tester_id);
      if (update.level < update.lastLevel) {
        downgrades.push(update.tester_id);
      } else if (update.level > update.lastLevel) {
        upgrades.push(update.tester_id);
      }
    }
  });
  for (let level in byLevel) {
    if (byLevel.hasOwnProperty(level)) {
      await db.query(
        `
        UPDATE wp_appq_activity_level
        SET level_id = ${level}, start_date = NOW()
        WHERE tester_id IN (${byLevel[level].map((id) => `${id}`).join(",")});
      `
      );
    }
  }
  return byLevel;
};
