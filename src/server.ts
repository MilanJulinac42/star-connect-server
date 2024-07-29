import express, { Request, Response } from "express";
import AppDataSource from "./database/database";

const app = express();
const port = 4000;

app.get("/", (req: Request, res: Response) => {
  res.send("HELLO FROM EXPRESS");
});

AppDataSource.initialize()
  .then(() => {
    console.log("Connected to database");
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Error during database connection:", err);
  });
