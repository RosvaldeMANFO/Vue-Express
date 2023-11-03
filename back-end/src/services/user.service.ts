import Auth from "../middlewares/auth";
import { RequestSuccess, HttpCode, RequestFailure } from "../utils/request_result";
import Utils from "../utils/utils";
import User, { IUser, UserInput } from "../models/user.model";

interface IUserService {
  register(user: UserInput): Promise<void>;

  login(email: string, password: string): Promise<RequestSuccess<any>>;
}

class UserService implements IUserService {
  constructor() {}

  register = async (
    user: UserInput
  ): Promise<void> => {
    const newUser: UserInput = {
      fullName: user.fullName,
      email: user.email,
      password: user.password,
    };
    const foundUser = await User.findOne({ email: user.email });
    if (foundUser != null) {
      throw new RequestFailure(
        HttpCode.BAD_REQUEST,
        "Registration failed",
        "This email address is already used"
      );
    }
    await User.create(newUser);
  };

  login = async (email: string, password: string): Promise<RequestSuccess<any>> => {
    let query = { email: email };
    const user = await User.findOne(query);
    if (!user) {
      throw new Error("Invalid email address");
    } else {
      const result = await Utils.compareEncrypted(password, user.password);
      if (!result) {
        throw new Error("Invalid password");
      }
      const token = Auth.provideToken(user.email);
      return new RequestSuccess<{}>(
        HttpCode.OK,
        {
          user,
          token,
        },
        "Login succeed"
      );
    }
  };
}

export { UserService, IUserService };
