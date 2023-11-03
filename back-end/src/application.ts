import express, { Express } from "express";
import cors from "cors";
import ApplicationController from "./controllers";
import ApplicationRouter from "./routes";
import ApplicationService from "./services";
import { connectToDatabase } from "./models";
import { loggerMiddleware } from "./middlewares/logger";
import { errorHandler } from "./middlewares/error_handler";

export default class Application {
  private server!: Express;
  private corsOption = {
    origin: true,
    credentials: true,
  };
  private port: string = process.env.PORT || "8080";

  startServer(): void {
    this.server = express();
    this.server.use(cors(this.corsOption));
    this.server.use(express.json());
    this.server.use(express.urlencoded({ extended: true }));
    this.server.use(loggerMiddleware);
    this.buildInfrastructure();
    this.server.listen(this.port, async () => {
      await connectToDatabase();
      console.log(
        `Server is running on port ${this.port}\nConnection with database established 😊`
      );
    });
  }

  private buildInfrastructure(): void {
    const services = new ApplicationService();
    const controllers = new ApplicationController(services);
    const router = new ApplicationRouter(controllers);
    this.server.use("/api/v1", router.routes);
    this.server.use(errorHandler);
  }
}
