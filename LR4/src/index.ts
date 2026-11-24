import express from "express";
import path from "node:path";
import stocksRouter from "./routes/stocks";
import * as stocksService from "./services/stocksService";

const app = express();
const port = 3000;
const dataFilePath = path.resolve(__dirname, "../src/data/stocks.json");

stocksService.init(dataFilePath);

app.use(express.json());

app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.get("/", (_req, res) => {
    res.send("Express сервер работает!");
});

app.use("/stocks", stocksRouter);

app.use((req, res) => {
    res.status(404).json({error: "Маршрут не найден"});
});

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(error);
    res.status(500).json({error: "Внутренняя ошибка сервера"});
});

app.listen(port, () => {
    console.log(`Сервер запущен по адресу http://localhost:${port}`);
});
