"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = init;
exports.findAll = findAll;
exports.findOne = findOne;
exports.create = create;
exports.update = update;
exports.remove = remove;
const fileService_1 = require("./fileService");
let dataFilePath;
function getDataFilePath() {
    if (!dataFilePath) {
        throw new Error("Путь к файлу карточек не инициализирован");
    }
    return dataFilePath;
}
function isStock(value) {
    if (typeof value !== "object" || value === null) {
        return false;
    }
    const stock = value;
    return Number.isInteger(stock.id)
        && typeof stock.src === "string"
        && typeof stock.title === "string"
        && typeof stock.text === "string";
}
function readStocks() {
    const data = (0, fileService_1.readData)(getDataFilePath());
    if (!Array.isArray(data) || !data.every(isStock)) {
        throw new TypeError("Файл карточек содержит данные неверного формата");
    }
    return data;
}
function init(filePath) {
    dataFilePath = filePath;
}
function findAll(title) {
    const stocks = readStocks();
    if (!title?.trim()) {
        return stocks;
    }
    const search = title.toLowerCase();
    return stocks.filter((stock) => stock.title.toLowerCase().includes(search));
}
function findOne(id) {
    return readStocks().find((stock) => stock.id === id);
}
function create(stockData) {
    const stocks = readStocks();
    const id = stocks.reduce((maxId, stock) => Math.max(maxId, stock.id), 0) + 1;
    const newStock = { id, ...stockData };
    stocks.push(newStock);
    (0, fileService_1.writeData)(getDataFilePath(), stocks);
    return newStock;
}
function update(id, stockData) {
    const stocks = readStocks();
    const index = stocks.findIndex((stock) => stock.id === id);
    if (index === -1) {
        return undefined;
    }
    const updatedStock = { ...stocks[index], ...stockData };
    stocks[index] = updatedStock;
    (0, fileService_1.writeData)(getDataFilePath(), stocks);
    return updatedStock;
}
function remove(id) {
    const stocks = readStocks();
    const filteredStocks = stocks.filter((stock) => stock.id !== id);
    if (filteredStocks.length === stocks.length) {
        return false;
    }
    (0, fileService_1.writeData)(getDataFilePath(), filteredStocks);
    return true;
}
