export default async (db: {
  query: (query: string) => Promise<any>;
}): Promise<
  {
    id: number;
    display_name: string;
    reach: number | null;
    hold: number | null;
  }[]
> => {
  return await db.query(`
    SELECT id, display_name, reach, hold
    FROM wp_appq_activity_level_definition
  `);
};
