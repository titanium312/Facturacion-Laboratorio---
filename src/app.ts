import express, { Request, Response } from "express";
import router from "./Router/Router";
import path from "path";

const app = express();
const PORT = 3000;

app.use(express.json());

// ✅ SIEMPRE apunta a la raíz del proyecto
const publicPath = path.join(process.cwd(), "public");

app.use(express.static(publicPath));

app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

app.use("/Roberto", router);

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
