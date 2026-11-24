import type {Request, Response} from "express";
import * as stocksService from "../services/stocksService";
import type {NewStock, StockUpdate} from "../types/stock";

function isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStockPayload(value: unknown): value is NewStock {
    return isObject(value)
        && typeof value.src === "string" && value.src.trim().length > 0
        && typeof value.title === "string" && value.title.trim().length > 0
        && typeof value.text === "string" && value.text.trim().length > 0;
}

function isStockUpdate(value: unknown): value is StockUpdate {
    if (!isObject(value)) {
        return false;
    }

    const fields = Object.keys(value);
    const allowedFields = ["src", "title", "text"];
    return fields.length > 0
        && fields.every((field) => allowedFields.includes(field)
            && typeof value[field] === "string"
            && (value[field] as string).trim().length > 0);
}

function parseId(value: string): number | undefined {
    const id = Number(value);
    return Number.isInteger(id) && id > 0 ? id : undefined;
}

function getId(req: Request): number | undefined {
    const rawId = req.params.id;
    return typeof rawId === "string" ? parseId(rawId) : undefined;
}

export function getAllStocks(req: Request, res: Response): void {
    const title = typeof req.query.title === "string" ? req.query.title : undefined;
    res.json(stocksService.findAll(title));
}

export function getStockById(req: Request, res: Response): void {
    const id = getId(req);
    if (id === undefined) {
        res.status(400).json({error: "Некорректный ID карточки"});
        return;
    }

    const stock = stocksService.findOne(id);
    if (!stock) {
        res.status(404).json({error: "Карточка не найдена"});
        return;
    }
    res.json(stock);
}

export function createStock(req: Request, res: Response): void {
    const payload: unknown = req.body;
    if (!isStockPayload(payload)) {
        res.status(400).json({error: "Не все поля заполнены"});
        return;
    }

    const newStock = stocksService.create(payload);
    res.status(201).json(newStock);
}

export function updateStock(req: Request, res: Response): void {
    const id = getId(req);
    if (id === undefined) {
        res.status(400).json({error: "Некорректный ID карточки"});
        return;
    }

    const payload: unknown = req.body;
    if (!isStockUpdate(payload)) {
        res.status(400).json({error: "Некорректные данные карточки"});
        return;
    }

    const updatedStock = stocksService.update(id, payload);
    if (!updatedStock) {
        res.status(404).json({error: "Карточка не найдена"});
        return;
    }
    res.json(updatedStock);
}

export function deleteStock(req: Request, res: Response): void {
    const id = getId(req);
    if (id === undefined) {
        res.status(400).json({error: "Некорректный ID карточки"});
        return;
    }

    if (!stocksService.remove(id)) {
        res.status(404).json({error: "Карточка не найдена"});
        return;
    }
    res.status(204).send();
}
