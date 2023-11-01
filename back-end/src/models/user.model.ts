import mongoose, { Schema } from "mongoose";
import { Roles } from "./constants";
import Utils from "../utils/utils";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  roles: string[];
  comparePassword: (enteredPassword: string) => boolean;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      types: String,
      required: true,
      unique: true,
    },
    password: {
      types: String,
      required: true,
    },
    roles: {
      type: [String],
      default: [Roles.Visitor],
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

const User = mongoose.model("User", userSchema);

export default User;
