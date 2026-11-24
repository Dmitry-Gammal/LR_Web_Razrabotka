"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllStocks = getAllStocks;
exports.getStockById = getStockById;
exports.createStock = createStock;
exports.updateStock = updateStock;
exports.deleteStock = deleteStock;
const stocksService = __importStar(require("../services/stocksService"));
function isObject(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}
function isStockPayload(value) {
    return isObject(value)
        && typeof value.src === "string" && value.src.trim().length > 0
        && typeof value.title === "string" && value.title.trim().length > 0
        && typeof value.text === "string" && value.text.trim().length > 0;
}
function isStockUpdate(value) {
    if (!isObject(value)) {
        return false;
    }
    const fields = Object.keys(value);
    const allowedFields = ["src", "title", "text"];
    return fields.length > 0
        && fields.every((field) => allowedFields.includes(field)
            && typeof value[field] === "string"
            && value[field].trim().length > 0);
}
function parseId(value) {
    const id = Number(value);
    return Number.isInteger(id) && id > 0 ? id : undefined;
}
function getId(req) {
    const rawId = req.params.id;
    return typeof rawId === "string" ? parseId(rawId) : undefined;
}
function getAllStocks(req, res) {
    const title = typeof req.query.title === "string" ? req.query.title : undefined;
    res.json(stocksService.findAll(title));
}
function getStockById(req, res) {
    const id = getId(req);
    if (id === undefined) {
        res.status(400).json({ error: "Некорректный ID карточки" });
        return;
    }
    const stock = stocksService.findOne(id);
    if (!stock) {
        res.status(404).json({ error: "Карточка не найдена" });
        return;
    }
    res.json(stock);
}
function createStock(req, res) {
    const payload = req.body;
    if (!isStockPayload(payload)) {
        res.status(400).json({ error: "Не все поля заполнены" });
        return;
    }
    const newStock = stocksService.create(payload);
    res.status(201).json(newStock);
}
function updateStock(req, res) {
    const id = getId(req);
    if (id === undefined) {
        res.status(400).json({ error: "Некорректный ID карточки" });
        return;
    }
    const payload = req.body;
    if (!isStockUpdate(payload)) {
        res.status(400).json({ error: "Некорректные данные карточки" });
        return;
    }
    const updatedStock = stocksService.update(id, payload);
    if (!updatedStock) {
        res.status(404).json({ error: "Карточка не найдена" });
        return;
    }
    res.json(updatedStock);
}
function deleteStock(req, res) {
    const id = getId(req);
    if (id === undefined) {
        res.status(400).json({ error: "Некорректный ID карточки" });
        return;
    }
    if (!stocksService.remove(id)) {
        res.status(404).json({ error: "Карточка не найдена" });
        return;
    }
    res.status(204).send();
}
