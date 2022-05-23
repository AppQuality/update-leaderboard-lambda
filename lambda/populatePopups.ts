import popupData from "./popupData";
const insertPopup = async (
  db: { query: (query: string) => Promise<any> },
  testerList: number[],
  title: string,
  content: string
) => {
  return await db.query(`
    INSERT INTO wp_appq_popups 
      (title,content,is_once,targets,extras,is_auto)
    VALUES
      ("${title}","${content}",1,"list","${testerList.join(",")}",1)
  `);
};

const populatePopups = async (
  db: { query: (query: string) => Promise<any> },
  popups: { [key: string]: number[] }
) => {
  for (const popupType in popups) {
    if (popupData.hasOwnProperty(popupType)) {
      const testerList = popups[popupType];
      if (testerList.length > 0) {
        const popupItem = popupData[popupType as keyof typeof popupData];
        await insertPopup(db, testerList, popupItem.title, popupItem.content);
      }
    }
  }
};
export default populatePopups;
