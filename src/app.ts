import express, { Request, Response } from "express";
import router from "./Router/Router";
import path from "path";

const app = express();

app.use(express.json());

// 👉 carpeta PUBLIC
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.use("/Roberto", router);

export default app;
