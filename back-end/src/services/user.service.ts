import { Collection } from "mongodb";
import Auth from "../middlewares/auth";
import {
  RequestResult,
  SuccessResult,
  HttpCode,
  ErrorResult,
} from "../utils/request_result";
import Utils from "../utils/utils";
import User from "../models/borrow.modelf";

interface UserService {
  register(
    username: string,
    email: string,
    password: string,
    phoneNumber: string
  ): Promise<RequestResult<string>>;

  login(email: string, password: string): Promise<RequestResult<any>>;
}

class UserServiceImplementation implements UserService {
  constructor(private userCollection: Collection<User>) {}

  register = async (
    username: string,
    email: string,
    password: string,
    phoneNumber: string
  ): Promise<RequestResult<string>> => {
    try {
      let hashedPassword = await Utils.encrypt(password);
      let foundUser: User = (await this.userCollection.findOne({ email: email })) as User;
      if (foundUser != null) {
        console.log(foundUser.email)
        throw Error("User already exists");
      }
      let user = new User(username, email, hashedPassword, phoneNumber);
      await this.userCollection.insertOne(user);
      return new SuccessResult<string>(
        HttpCode.OK,
        "User created",
        "Registering succeed"
      );
    } catch (error) {
      return new ErrorResult<string>(
        HttpCode.INTERNAL_SERVER_ERROR,
        "Registration failed",
        (error as Error).message
      );
    }
  };

  login = async (
    email: string,
    password: string
  ): Promise<RequestResult<any>> => {
    try {
      let query = { email: email };
      const foundUser = await this.userCollection.findOne(query);
      if (!foundUser) {
        return new ErrorResult<string>(
          HttpCode.NOT_FOUND,
          "Invalid email",
          "Email address was invalid"
        );
      } else {
        const result = await Utils.compareEncrypted(
          password,
          foundUser.password
        );
        if (!result) {
          return new ErrorResult<string>(
            HttpCode.NOT_FOUND,
            "Invalid password",
            "Password was'nt correct"
          );
        }
        const token = Auth.provideToken(foundUser.email);
        return new SuccessResult<any>(
          HttpCode.OK,
          {
            userId: foundUser._id,
            email: foundUser.email,
            token: token,
          },
          "Login succeed"
        );
      }
    } catch (error) {
      return new ErrorResult<string>(
        HttpCode.INTERNAL_SERVER_ERROR,
        "An unexpected error occurred",
        (error as Error).message
      );
    }
  };
}

export { UserServiceImplementation, UserService };
