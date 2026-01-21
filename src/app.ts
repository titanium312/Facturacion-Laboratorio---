import express, { Request, Response } from "express";
import router from "./Router/Router";
import path from "path";

const app = express();

app.use(express.json());

// ✅ siempre apunta a la raíz del proyecto
const publicPath = path.join(process.cwd(), "public");

app.use(express.static(publicPath));

app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

// tus rutas
app.use("/Roberto", router);

// ❌ NO listen()
// ✅ EXPORTA la app
export default app;
