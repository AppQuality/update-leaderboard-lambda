export default async (db: {
  query: (query: string) => Promise<any>;
}): Promise<
  {
    id: number;
    level: number;
    monthly_exp: number;
    total_exp: number;
  }[]
> => {
  const exp: { tester_id: number; monthly_exp: number }[] = await db.query(`
  SELECT exp.tester_id, SUM(exp.amount) as monthly_exp
  FROM wp_appq_exp_points exp
           JOIN wp_appq_evd_profile t ON (t.id = exp.tester_id)
  WHERE MONTH(exp.creation_date) = MONTH(NOW()) - 1
    AND YEAR(exp.creation_date) = YEAR(NOW())
    AND exp.amount != 0
    AND t.name != "Deleted User"
  GROUP BY (exp.tester_id);
  `);

  const levels: { id: number; level: number; total_exp: number }[] =
    await db.query(`SELECT lvl.tester_id   as id,
  lvl.level_id    as level,
  t.total_exp_pts as total_exp
FROM wp_appq_activity_level lvl
    JOIN wp_appq_evd_profile t ON (t.id = lvl.tester_id)
WHERE t.name <> "Deleted User"
GROUP BY (lvl.tester_id);
  `);

  return levels.map((level) => {
    const testerExp = exp.find((e) => e.tester_id === level.id);
    return {
      ...level,
      monthly_exp: testerExp ? testerExp.monthly_exp : 0,
    };
  });
};
