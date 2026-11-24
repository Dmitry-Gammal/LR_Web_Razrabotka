import {readData, writeData} from "./fileService";
import type {NewStock, Stock, StockUpdate} from "../types/stock";

let dataFilePath: string | undefined;

function getDataFilePath(): string {
    if (!dataFilePath) {
        throw new Error("Путь к файлу карточек не инициализирован");
    }
    return dataFilePath;
}

function isStock(value: unknown): value is Stock {
    if (typeof value !== "object" || value === null) {
        return false;
    }

    const stock = value as Record<string, unknown>;
    return Number.isInteger(stock.id)
        && typeof stock.src === "string"
        && typeof stock.title === "string"
        && typeof stock.text === "string";
}

function readStocks(): Stock[] {
    const data = readData(getDataFilePath());
    if (!Array.isArray(data) || !data.every(isStock)) {
        throw new TypeError("Файл карточек содержит данные неверного формата");
    }
    return data;
}

export function init(filePath: string): void {
    dataFilePath = filePath;
}

export function findAll(title?: string): Stock[] {
    const stocks = readStocks();
    if (!title?.trim()) {
        return stocks;
    }

    const search = title.toLowerCase();
    return stocks.filter((stock) => stock.title.toLowerCase().includes(search));
}

export function findOne(id: number): Stock | undefined {
    return readStocks().find((stock) => stock.id === id);
}

export function create(stockData: NewStock): Stock {
    const stocks = readStocks();
    const id = stocks.reduce((maxId, stock) => Math.max(maxId, stock.id), 0) + 1;
    const newStock: Stock = {id, ...stockData};
    stocks.push(newStock);
    writeData(getDataFilePath(), stocks);
    return newStock;
}

export function update(id: number, stockData: StockUpdate): Stock | undefined {
    const stocks = readStocks();
    const index = stocks.findIndex((stock) => stock.id === id);
    if (index === -1) {
        return undefined;
    }

    const updatedStock: Stock = {...stocks[index], ...stockData};
    stocks[index] = updatedStock;
    writeData(getDataFilePath(), stocks);
    return updatedStock;
}

export function remove(id: number): boolean {
    const stocks = readStocks();
    const filteredStocks = stocks.filter((stock) => stock.id !== id);
    if (filteredStocks.length === stocks.length) {
        return false;
    }

    writeData(getDataFilePath(), filteredStocks);
    return true;
}
