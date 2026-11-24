import {readFileSync, writeFileSync} from "node:fs";

export function readData(filePath: string): unknown {
    const contents = readFileSync(filePath, "utf8");
    const data: unknown = JSON.parse(contents);
    return data;
}

export function writeData(filePath: string, data: unknown): void {
    const contents = JSON.stringify(data, null, 2);
    if (contents === undefined) {
        throw new TypeError("Не удалось сериализовать данные");
    }

    writeFileSync(filePath, contents, "utf8");
}
