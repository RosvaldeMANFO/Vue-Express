import mongoose, { Schema } from "mongoose";
import { CollectionName, Roles } from "./constants";
import Utils from "../utils/utils";

export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  role: string;
  comparePassword: (enteredPassword: string) => boolean;
}

export type UserInput = {
  fullName: string;
  email: string;
  password: string;
};

const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: Roles.Reader,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await Utils.encrypt(this.password);
});

userSchema.methods.comparePassword = async function (enteredPassword: string) {
  return await Utils.compareEncrypted(enteredPassword, this.password);
};

const User = mongoose.model(CollectionName.Users, userSchema);

export default User;
