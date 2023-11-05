import mongoose from "mongoose";
import User from "./user.model";
import { Roles } from "./constants";

mongoose.Promise = global.Promise;

const connectToDatabase = async (): Promise<void> => {
  const cnString: string = `${process.env.DB_CONN_STRING}`;
  await mongoose.connect(cnString, {
    dbName: process.env.DB_NAME || "dev",
  });
  User.findOne({role: Roles.Admin}).then(user => {
    if(!user){
      User.create({
        fullName: "Admin",
        email: "Admin@admin.com",
        password: "Admin@007",
        role: Roles.Admin
      })
    }
  })  
};

export { connectToDatabase };
