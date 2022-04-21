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
  return await db.query(`
  SELECT lvl.tester_id                as id,
  lvl.level_id                 as level,
  t.total_exp_pts              as total_exp,
  COALESCE(SUM(exp.amount), 0) as monthly_exp
FROM wp_appq_activity_level lvl
    JOIN wp_appq_evd_profile t ON (t.id = lvl.tester_id)
    LEFT JOIN wp_appq_exp_points exp
              ON (exp.tester_id = lvl.tester_id AND MONTH(exp.creation_date) = MONTH(NOW()) - 1 AND
                  YEAR(exp.creation_date) = YEAR(NOW()) AND exp.amount != 0)
WHERE t.name <> "Deleted User"
GROUP BY (lvl.tester_id);
  `);
};
