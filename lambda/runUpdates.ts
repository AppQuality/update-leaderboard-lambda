export default (
  db: object,
  updates: ({ tester_id: number; level: number } | null)[]
) => {
  return updates.filter((update) => update !== null);
};
