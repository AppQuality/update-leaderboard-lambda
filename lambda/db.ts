import * as mysql from "mysql";

type InsertResult = {
  insertId: number;
};
class DB {
  db: mysql.Connection;

  constructor({
    host,
    user,
    password,
    database,
  }: {
    host: string;
    user: string;
    password: string;
    database: string;
  }) {
    const db = mysql.createConnection({
      host,
      user,
      password,
      database,
    });
    db.connect();
    this.db = db;
  }
  destroy() {
    this.db.end();
  }

  public format(query: string, data: (string | number)[]) {
    return mysql.format(query, data);
  }
  public query(
    query: string
  ): Promise<{ [key: string]: string | number }[] | InsertResult> {
    return new Promise((resolve, reject) => {
      this.db.query(query, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }
  public insert(query: string): Promise<InsertResult> {
    return new Promise((resolve, reject) => {
      this.db.query(query, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }
}

export default DB;
