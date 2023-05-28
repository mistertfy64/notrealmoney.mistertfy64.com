import { Schema, model } from "mongoose";

interface IUser {
  username: string;
  password: string;
  money: number;
  gems: number;
  sessionToken: string;
  membership: {
    isSuperAdministrator: boolean;
    isAdministrator: boolean;
  };
}

const userSchema = new Schema<IUser>({
  username: String,
  password: String,
  money: Number,
  gems: Number,
  sessionToken: String,
  membership: {
    isSuperAdministrator: Boolean,
    isAdministrator: Boolean,
  },
});

const User = model<IUser>("User", userSchema, "users");
export { User, IUser };
