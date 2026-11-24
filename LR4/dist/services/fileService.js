"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readData = readData;
exports.writeData = writeData;
const node_fs_1 = require("node:fs");
function readData(filePath) {
    const contents = (0, node_fs_1.readFileSync)(filePath, "utf8");
    const data = JSON.parse(contents);
    return data;
}
function writeData(filePath, data) {
    const contents = JSON.stringify(data, null, 2);
    if (contents === undefined) {
        throw new TypeError("Не удалось сериализовать данные");
    }
    (0, node_fs_1.writeFileSync)(filePath, contents, "utf8");
}
