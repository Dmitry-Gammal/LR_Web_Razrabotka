export interface Stock {
    id: number;
    src: string;
    title: string;
    text: string;
}

export type NewStock = Omit<Stock, "id">;
export type StockUpdate = Partial<NewStock>;
