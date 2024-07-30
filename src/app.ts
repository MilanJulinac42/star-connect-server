import "reflect-metadata";
import { useExpressServer } from "routing-controllers";
import { Container } from "typedi";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
// import { currentUserChecker } from "./middleware/authChecker";

// Create the Express app
const app = express();

// Apply middleware
app.use(morgan("dev"));
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Apply rate limiter for all requests
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter);

useExpressServer(app, {
  // Register controllers
  controllers: [__dirname + "/controllers/*.ts"],
  //   middlewares: [currentUserChecker],
  defaultErrorHandler: false,
});

// Custom Error Handler
app.use((err: any, req: any, res: any, next: (err?: any) => any) => {
  console.error(err.stack); // Log the error for debugging
  res.status(500).json({ error: "Something went wrong!" }); // Generic error response
});

export default app;
