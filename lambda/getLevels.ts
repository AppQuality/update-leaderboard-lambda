export default (
  db: object
): {
  id: number;
  display_name: string;
  reach: number | null;
  hold: number | null;
}[] => {
  return [
    {
      id: 10,
      display_name: "Basic",
      reach: 0,
      hold: null,
    },
    {
      id: 20,
      display_name: "Bronze",
      reach: 100,
      hold: 50,
    },
    {
      id: 30,
      display_name: "Silver",
      reach: 250,
      hold: 150,
    },
    {
      id: 40,
      display_name: "Gold",
      reach: 500,
      hold: 300,
    },
    {
      id: 50,
      display_name: "Platinum",
      reach: 1000,
      hold: 600,
    },
    {
      id: 60,
      display_name: "Diamond",
      reach: 3000,
      hold: 2000,
    },
    {
      id: 100,
      display_name: "Black",
      reach: null,
      hold: null,
    },
  ];
};
