import { Db, MongoClient } from "mongodb";

enum CollectionName {
  USERS = "users",
}

class Database {
  db!: Db;

  connectToDatabase = () => {
    let conString: string = `${process.env.DB_CONN_STRING}`;
    let client: MongoClient = new MongoClient(conString);
    client.connect();
    this.db = client.db(`${process.env.DB_NAME}`);
  };
}

export {Database, CollectionName}