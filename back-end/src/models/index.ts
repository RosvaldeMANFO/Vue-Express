import mongoose, { ConnectOptions } from "mongoose";

mongoose.Promise = global.Promise;

const connectToDatabase = async (): Promise<void> => {
  let cnString: string = `${process.env.DB_CONN_STRING}`;
  await mongoose.connect(cnString);
};

export { connectToDatabase };
