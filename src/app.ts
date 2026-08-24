import express, { Request, Response } from "express";
import router from "./Router/Router";
import temprt from "./temp/Router";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000; // ✅ IMPORTANTE para Render

app.use(express.json());

const publicPath = path.join(process.cwd(), "public");
app.use(express.static(publicPath));

app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

app.use("/Roberto", router);
app.use("/", temprt);


app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en  http://localhost:${PORT}`);
});