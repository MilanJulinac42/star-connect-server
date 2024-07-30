import "reflect-metadata";
import { useExpressServer } from "routing-controllers";
import { Container } from "typedi";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import session from "express-session";
// import { currentUserChecker } from "./middleware/authChecker";

const app = express();

// Apply middleware
app.use(morgan("dev"));
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
    // cookie: { secure: true } // Uncomment in production
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

useExpressServer(app, {
  controllers: [__dirname + "/controllers/*.ts"],
  //   middlewares: [currentUserChecker],
  defaultErrorHandler: false,
});

app.use((err: any, req: any, res: any, next: (err?: any) => any) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

export default app;
