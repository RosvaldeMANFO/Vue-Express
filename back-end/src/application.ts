import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
import ApplicationController from "./controllers";
import ApplicationRouter from "./routes";
import ApplicationService from "./services";
import { Database } from "./models";
import { logger } from "./middlewares/request_handler";

export default class Application {
  private server!: Express;
  private corsOption = {
    origin: true,
    credentials: true,
  };
  private port: string = process.env.PORT || "8080";
  private dbInstance = new Database();

  startServer(): void {
    this.server = express();
    this.server.use(cors(this.corsOption));
    this.server.use(express.json());
    this.server.use(express.urlencoded({ extended: true }));
    this.server.use(logger);
    this.dbInstance.connectToDatabase();
    this.buildInfrastructure();
    this.server.listen(this.port, () => {
      console.log(
        `Server is running on port ${this.port}\nConnection with database established 😊`
      );
    });
  }

  private buildInfrastructure(): void {
    const services = new ApplicationService(this.dbInstance.db);
    const controllers = new ApplicationController(services);
    const router = new ApplicationRouter(controllers);
    this.server.use("/api/v1", router.routes);
  }
}
